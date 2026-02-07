
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ContactMessage = sequelize.define('ContactMessage', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('new', 'read'),
    defaultValue: 'new'
  }
}, {
  timestamps: true
});

export default ContactMessage;
