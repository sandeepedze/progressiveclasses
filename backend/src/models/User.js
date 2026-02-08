const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING(36), // Explicitly matching CHAR(36)
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    profile_pic: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'suspended', 'blocked'),
        defaultValue: 'active',
    },
    last_login: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = User;

