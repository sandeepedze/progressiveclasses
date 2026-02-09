const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, Institute, Role, OrganizationDetail, PasswordReset } = require('../models');

const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user exists
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Default Role: SCHOOL_ADMIN (for new registrations)
        const schoolAdminRole = await Role.findOne({ where: { role_code: 'SCHOOL_ADMIN' } });
        if (!schoolAdminRole) {
            return res.status(500).json({ message: 'System Error: Default role not found' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role_id: schoolAdminRole.id,
            // edu_type_id removed
            phone,
            status: 'active'
        });

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, role: schoolAdminRole.role_code },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role_code: schoolAdminRole.role_code,
                is_setup_complete: false // New user always incomplete
            }
        });
    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({ message: `Register Error: ${err.message}` });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[Login] Attempt for: ${email}`);

        // Check for user
        const user = await User.findOne({
            where: { email },
            include: [
                { model: Role },
                { model: OrganizationDetail }
            ]
        });
        console.log(`[Login] User found: ${!!user}`);

        if (!user) {
            return res.status(400).json({ message: 'Invalid Email or Password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`[Login] Password match: ${isMatch}`);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Email or Password' });
        }

        const roleCode = user.Role ? user.Role.role_code : null;
        const isSetupComplete = !!user.OrganizationDetail;
        console.log(`[Login] Role: ${roleCode}, SetupComplete: ${isSetupComplete}`);

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, role: roleCode },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role_code: roleCode,
                role: roleCode, // keeping legacy support if needed
                is_setup_complete: isSetupComplete,
                is_setup_complete: isSetupComplete,
                profile_pic: user.profile_pic
            }
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: `Login Error: ${err.message}` });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Role },
                { model: OrganizationDetail }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const roleCode = user.Role ? user.Role.role_code : null;
        const isSetupComplete = !!user.OrganizationDetail;

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role_code: roleCode,
            role: roleCode,
            is_setup_complete: isSetupComplete,
            organization: user.OrganizationDetail ? user.OrganizationDetail.toJSON() : null
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { contact } = req.body; // Email or Phone
        if (!contact) return res.status(400).json({ message: 'Contact is required' });

        // Find user by email or phone
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: contact }, { phone: contact }]
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Save OTP
        await PasswordReset.create({
            contact,
            otp,
            expires_at: expiresAt
        });

        // Send OTP (Mock)
        console.log(`[DEBUG] OTP for ${contact}: ${otp}`);

        res.json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { contact, otp } = req.body;

        const record = await PasswordReset.findOne({
            where: {
                contact,
                otp,
                expires_at: { [Op.gt]: new Date() }
            },
            order: [['created_at', 'DESC']]
        });

        if (!record) {
            return res.status(400).json({ message: 'Invalid or Expired OTP' });
        }

        res.json({ message: 'OTP Verified' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { contact, otp, newPassword } = req.body;

        // Verify OTP again
        const record = await PasswordReset.findOne({
            where: {
                contact,
                otp,
                expires_at: { [Op.gt]: new Date() }
            },
            order: [['created_at', 'DESC']]
        });

        if (!record) {
            return res.status(400).json({ message: 'Invalid or Expired OTP' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update User
        // We need to find the user first to ensure we update the right one
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: contact }, { phone: contact }]
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ password: hashedPassword });

        // Clean up used OTPs
        await PasswordReset.destroy({ where: { contact } });

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const logout = async (req, res) => {
    try {
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    register,
    login,
    getMe,
    logout,
    forgotPassword,
    verifyOtp,
    resetPassword
};
