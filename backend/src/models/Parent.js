const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Parent = sequelize.define('Parent', {
    id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
    },
    whatsapp: {
        type: DataTypes.STRING,
    },
    occupation: {
        type: DataTypes.STRING,
    },
    institute_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
    }
}, {
    tableName: 'parents',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Parent;