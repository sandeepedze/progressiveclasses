const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Fee = sequelize.define('Fee', {
    id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    student_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
    },
    course_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    paid_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM('unpaid', 'partial', 'paid'),
        defaultValue: 'unpaid',
    },
    due_date: {
        type: DataTypes.DATEONLY,
    }
}, {
    tableName: 'fees',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Fee;