const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const EduType = sequelize.define('EduType', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'edu_type',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // edu_type table only has created_at in setupDb.js
});

module.exports = EduType;
