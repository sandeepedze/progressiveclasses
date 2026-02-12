const { EduType, OrganizationDetail, User, Role } = require('../models');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const getEduTypes = async (req, res) => {
    try {
        const types = await EduType.findAll({
            // Assuming active checks if you add is_active column, but for now just all
            attributes: ['id', 'type_name']
        });
        res.json(types);
    } catch (err) {
        console.error('Fetch EduTypes Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const setupOrganization = async (req, res) => {
    try {
        const {
            organization_name,
            contact,
            email,
            address,
            city,
            state,
            country,
            zip_code,
            edu_type_id,
            logo
        } = req.body;

        const userId = req.user.id;

        // Check if already exists
        let org = await OrganizationDetail.findOne({ where: { user_id: userId } });
        if (org) {
            return res.status(400).json({ message: 'Organization details already setup' });
        }

        org = await OrganizationDetail.create({
            organization_name,
            contact,
            email,
            address,
            city,
            state,
            country,
            zip_code,
            edu_type_id,
            logo,
            subscription_id: 5 // Default free only first time
        });

        res.status(201).json({
            message: 'Setup Complete',
            organization: org
        });

    } catch (err) {
        console.error('Setup Org Error:', err);
        res.status(500).json({ message: 'Server Error during setup' });
    }
};

// ADMIN: Get All Organizations (Raw SQL)
const getAdminAllOrganizations = async (req, res) => {
    try {
        // Raw SQL Query to fetch organizations with joined details
        // Include Subscription Plan details as requested: active plan, validity (using created_at + duration logic for now)
        // Since we don't store explict start/end date yet, we calculate validity dynamically or assume defaults.
        // The most robust way is to join subscription_plans.
        const query = `
            SELECT 
                od.id, 
                od.organization_name, 
                et.type_name as type, 
                u.email, 
                u.mobile, 
                u.is_active as status, 
                od.contact as contact,
                od.created_at,
                sp.plan_name as subscription_plan,
                sp.price as subscription_price,
                sp.duration as subscription_duration,
                sp.id as subscription_plan_id
            FROM organization_details od
            LEFT JOIN edu_type et ON od.edu_type_id = et.id
            LEFT JOIN users u ON od.user_id = u.id
            LEFT JOIN subscription_plans sp ON od.subscription_id = sp.id
            ORDER BY od.created_at DESC
        `;

        const [results, metadata] = await sequelize.query(query);

        // Helper to calculate End Date based on duration enum/int
        const calculateEndDate = (startDate, duration) => {
            if (!startDate) return null;
            const start = new Date(startDate);

            // Handle new ENUM durations
            if (duration === '7_days') return new Date(start.setDate(start.getDate() + 7));
            if (duration === '3_months') return new Date(start.setMonth(start.getMonth() + 3));
            if (duration === '6_months') return new Date(start.setMonth(start.getMonth() + 6));
            if (duration === '12_months') return new Date(start.setMonth(start.getMonth() + 12));
            if (duration === 'lifetime') return new Date(9999, 11, 31); // Far future

            // Handle legacy INT durations (months)
            if (typeof duration === 'number') return new Date(start.setMonth(start.getMonth() + duration));

            return null;
        };

        // Format data
        const formatted = results.map(org => {
            const endDate = calculateEndDate(org.created_at, org.subscription_duration);
            const now = new Date();
            const isActive = endDate ? endDate > now : false; // Simple validity check

            return {
                id: org.id,
                organization_name: org.organization_name,
                type: org.type || 'N/A',
                email: org.email,
                mobile: org.contact || org.mobile,
                status: org.status ? 'Active' : 'Inactive',
                created_at: org.created_at,
                subscription: {
                    plan_name: org.subscription_plan || 'No Plan',
                    price: org.subscription_price,
                    validity: {
                        start_date: org.created_at,
                        end_date: endDate,
                        status: isActive ? 'Active' : 'Expired'
                    }
                }
            };
        });

        res.json(formatted);
    } catch (err) {
        console.error('Admin Fetch Orgs Error:', err, err.original); // Log full error details
        res.status(500).json({ message: 'Server Error', error: err.message }); // Send error specific to client for easier debug
    }
};

// ADMIN: Create Organization
const createAdminOrganization = async (req, res) => {
    try {
        // Form fields from requirements: Org Name, Type, Owner Name, Email, Mobile, Password, Address, Status
        const {
            organization_name,
            edu_type_id,
            owner_name,
            email,
            mobile,
            password,
            address,
            status // 'Active' / 'Inactive'
        } = req.body;

        // 1. Check if user exists
        const userExists = await User.findOne({ where: { email } });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // 2. Create User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let roleCode = 'SCHOOL_ADMIN';
        if (edu_type_id == 2) roleCode = 'INSTITUTE_ADMIN';
        if (edu_type_id == 3) roleCode = 'COACHING_ADMIN';
        if (edu_type_id == 4) roleCode = 'TUITION_ADMIN';

        const role = await Role.findOne({ where: { role_code: roleCode } });
        const role_id = role ? role.id : 2;

        const newUser = await User.create({
            name: owner_name,
            email,
            mobile,
            password: hashedPassword,
            role_id: role_id,
            is_active: status === 'Active' ? 1 : 0,
            is_setup_complete: 1
        });

        // 3. Create Organization Detail
        const newOrg = await OrganizationDetail.create({
            user_id: newUser.id,
            organization_name,
            edu_type_id,
            address,
            email,
            contact: mobile,
            status: status === 'Active' ? 1 : 0
        });

        res.status(201).json({ message: 'Organization Created Successfully', organization: newOrg });

    } catch (err) {
        console.error('Admin Create Org Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getEduTypes,
    setupOrganization,
    getAdminAllOrganizations,
    createAdminOrganization
};
