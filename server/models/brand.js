const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');
const Merchant = require('./merchant');

const Brand = sequelize.define('Brand', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  merchant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'merchants',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'brands',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Brand.belongsTo(Merchant, {
  foreignKey: 'merchant_id',
  as: 'merchant'
});

Merchant.hasMany(Brand, {
  foreignKey: 'merchant_id',
  as: 'brands'
});

module.exports = Brand;
