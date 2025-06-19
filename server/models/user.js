const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');
const { ROLES, EMAIL_PROVIDER } = require('../constants');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  merchant_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'merchants',
      key: 'id'
    }
  },
  provider: {
    type: DataTypes.ENUM(Object.values(EMAIL_PROVIDER)),
    allowNull: false,
    defaultValue: EMAIL_PROVIDER.Email
  },
  google_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  facebook_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM(Object.values(ROLES)),
    allowNull: false,
    defaultValue: ROLES.Member
  },
  reset_password_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reset_password_expires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
