const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    role_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    is_system_role: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
}, {
    tableName: 'roles',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // roles table only has created_at in setupDb.js
});

module.exports = Role;
