const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    defaultValue: 'pending'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentStatus: {
    type: DataTypes.ENUM(['pending', 'paid', 'failed']),
    defaultValue: 'pending'
  }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'updated'
});

module.exports = Order;
