const { User } = require('../models');
const { sequelize } = require('../config/db');

async function testModel() {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');

        // Test Create - see what SQL is generated
        console.log('Testing User.create...');
        const user = await User.create({
            name: 'Test Setup',
            email: `test_setup_${Date.now()}@test.com`,
            password: 'password',
            role_id: 2, // School Admin
            edu_type_id: 1,
            profilePic: 'test.jpg', // Trying to set it
            status: 'active'
        }, { logging: console.log });

        console.log('User created:', user.id);

    } catch (err) {
        console.error('Test Error:', err);
    } finally {
        await sequelize.close();
    }
}

testModel();
