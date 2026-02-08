const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Batch = sequelize.define('Batch', {
    id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    course_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
    },
    teacher_id: {
        type: DataTypes.STRING(36),
    },
    start_date: {
        type: DataTypes.DATEONLY,
    },
    end_date: {
        type: DataTypes.DATEONLY,
    },
    capacity: {
        type: DataTypes.INTEGER,
    },
    timing: {
        type: DataTypes.STRING,
    },
    institute_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
    }
}, {
    tableName: 'batches',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Batch;
