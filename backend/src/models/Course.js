const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: DataTypes.STRING,
    },
    fee_structure: {
        type: DataTypes.ENUM('monthly', 'quarterly', 'one-time'),
        defaultValue: 'monthly',
    },
    total_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    institute_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
    }
}, {
    tableName: 'courses',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Course;
