
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Appointment = sequelize.define('Appointment', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  serviceKey: {
    type: DataTypes.STRING,
    allowNull: false
  },
  serviceLabel: {
    type: DataTypes.STRING,
    allowNull: false
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  couponCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  discountAmount: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  finalPrice: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  depositAmount: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  paidAmount: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  barionPaymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  barionPaymentRequestId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'unpaid'
  },
  staffId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  staffName: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Nincs megadva'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  }
});

export default Appointment;
