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
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  merchantId: {
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
  googleId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  facebookId: {
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
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'updated'
});

module.exports = User;
