const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const OrganizationDetail = sequelize.define('OrganizationDetail', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    organization_name: {
        type: DataTypes.STRING,
    },
    contact: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.TEXT,
    },
    city: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING,
    },
    zip_code: {
        type: DataTypes.STRING,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    edu_type_id: {
        type: DataTypes.INTEGER,
    },
    logo: {
        type: DataTypes.STRING,
    },
    subscription_id: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
    },
}, {
    tableName: 'organization_details',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = OrganizationDetail;
