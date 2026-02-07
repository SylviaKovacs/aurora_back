
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  name: {
  type: DataTypes.STRING,
  allowNull: false
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true, 
    validate: { isEmail: true } 
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressZip: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressCity: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressStreet: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressHouseNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: true
  },
  providerId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: true, 
    validate: { len: [8, 100] } 
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'staff'),
    defaultValue: 'user'
  },
  newsletter: {
  type: DataTypes.BOOLEAN,
  defaultValue: false
},
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  blacklisted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  blacklistReason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  blacklistedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refreshTokenHash: {
    type: DataTypes.STRING,
    allowNull: true
  },
  refreshTokenExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resetPasswordTokenHash: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  timestamps: true,
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password'] }
    }
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.prototype.checkPassword = async function (plain) {
  return bcrypt.compare(plain, this.getDataValue('password'));
};

export default User;
