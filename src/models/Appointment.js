import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Service from './Service.js';

const Appointment = sequelize.define('Appointment', {
  date: { type: DataTypes.DATE, allowNull: false },
  status: { 
    type: DataTypes.ENUM('booked', 'cancelled', 'completed'), 
    defaultValue: 'booked' 
  },
  appointment_time: { type: DataTypes.DATE, allowNull: false }
}, {
  timestamps: true
});

// Users ⇔ Appointments
User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

// Services ⇔ Appointments
Service.hasMany(Appointment, { foreignKey: 'serviceId' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId' });

export default Appointment;
