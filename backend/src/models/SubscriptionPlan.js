const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    plan_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    duration: {
        type: DataTypes.ENUM('7_days', '3_months', '6_months', '12_months', 'lifetime'),
        allowNull: false,
        defaultValue: '7_days',
        comment: 'Duration of the subscription plan'
    },
    edu_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Associated Education Type ID'
    },
    features: {
        type: DataTypes.JSON, // Using JSON type
        allowNull: true,
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
    },
}, {
    tableName: 'subscription_plans',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // Requirement only mentions created_at, but Sequelize usually wants updated_at. We can disable if strict.
});

module.exports = SubscriptionPlan;
