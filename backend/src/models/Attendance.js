const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    student_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
    },
    batch_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('present', 'absent', 'leave'),
        allowNull: false,
    },
    marked_by: {
        type: DataTypes.STRING(36),
        allowNull: false,
    }
}, {
    tableName: 'attendances',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Attendance;