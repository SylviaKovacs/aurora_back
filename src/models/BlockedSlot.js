import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const BlockedSlot = sequelize.define('BlockedSlot', {
  staffId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

export default BlockedSlot;
