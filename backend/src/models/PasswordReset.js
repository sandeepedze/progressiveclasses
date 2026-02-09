const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PasswordReset = sequelize.define('PasswordReset', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'password_resets',
    underscored: true,
    timestamps: true,
    updatedAt: false, // Only need created_at
    createdAt: 'created_at',
});

module.exports = PasswordReset;
