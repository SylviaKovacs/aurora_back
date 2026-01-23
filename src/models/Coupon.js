import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Coupon = sequelize.define('Coupon', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'percent'
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  usageCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  minSpend: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  maxDiscount: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
});

export default Coupon;
