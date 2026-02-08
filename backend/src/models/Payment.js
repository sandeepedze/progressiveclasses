const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    fee_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    payment_mode: {
        type: DataTypes.ENUM('cash', 'upi'),
        allowNull: false,
    },
    transaction_id: {
        type: DataTypes.STRING,
    },
    collected_by: {
        type: DataTypes.STRING(36),
        allowNull: false,
    },
    receipt_number: {
        type: DataTypes.STRING,
        unique: true,
    }
}, {
    tableName: 'payments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Payment;
