const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { sequelize } = require('./config/db');

console.log('DB Config:', {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME
});

(async () => {
    try {
        const [results, metadata] = await sequelize.query(`
            SELECT id, plan_name, status, edu_type_id FROM subscription_plans
        `);
        console.log('All Plans:', JSON.stringify(results, null, 2));
    } catch (error) {
        console.error('Error fetching plans:', error);
    } finally {
        await sequelize.close();
    }
})();
