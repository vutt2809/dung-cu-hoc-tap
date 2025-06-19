const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const { MERCHANT_STATUS } = require('../constants');

const Merchant = sequelize.define('Merchant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true
  },
  business: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  brand_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: MERCHANT_STATUS.Waiting_Approval,
    enum: [
      MERCHANT_STATUS.Waiting_Approval,
      MERCHANT_STATUS.Rejected,
      MERCHANT_STATUS.Approved
    ]
  }
}, {
  tableName: 'merchants',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Merchant;
