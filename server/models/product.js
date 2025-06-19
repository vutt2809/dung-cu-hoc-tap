const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imageKey: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  taxable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  brandId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'brands',
      key: 'id'
    }
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  merchantId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'merchants',
      key: 'id'
    }
  }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'updated'
});

module.exports = Product;
