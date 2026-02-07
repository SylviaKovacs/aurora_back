
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Review = sequelize.define('Review', {
  appointmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  staffId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  serviceKey: {
    type: DataTypes.STRING,
    allowNull: true
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending'
  }
});

export default Review;
