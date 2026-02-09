const { EduType, OrganizationDetail } = require('../models');

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
            user_id: userId,
            edu_type_id,
            logo,
            subscription_id: 5 // Default
        });

        // Sync User's edu_type_id
        await User.update(
            { edu_type_id: edu_type_id },
            { where: { id: userId } }
        );

        res.status(201).json({
            message: 'Setup Complete',
            organization: org
        });

    } catch (err) {
        console.error('Setup Org Error:', err);
        res.status(500).json({ message: 'Server Error during setup' });
    }
};

module.exports = {
    getEduTypes,
    setupOrganization
};
