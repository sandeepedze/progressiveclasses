const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Institute = sequelize.define('Institute', {
    id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
    },
    contact: {
        type: DataTypes.STRING,
    },
    logo: {
        type: DataTypes.STRING,
    },
    admin_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
    },
    edu_type_id: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
}, {
    tableName: 'institutes',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Institute;

