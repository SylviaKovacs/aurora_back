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

  // ✅ ÚJ MEZŐ: szakember neve
  staffName: {
    type: DataTypes.STRING,
    allowNull: true,       // lehet null, hogy a régi foglalások ne törjenek el
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
