const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
    },
    dob: {
        type: DataTypes.DATEONLY,
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
    },
    address: {
        type: DataTypes.TEXT,
    },
    parent_id: {
        type: DataTypes.STRING(36),
    },
    institute_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
    },
    admission_status: {
        type: DataTypes.ENUM('pending', 'confirmed'),
        defaultValue: 'pending',
    }
}, {
    tableName: 'students',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Student;