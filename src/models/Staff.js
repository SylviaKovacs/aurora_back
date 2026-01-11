import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Staff = sequelize.define('Staff', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING, // pl. fodrász, kozmetikus, masszőr
    allowNull: false
  },
  services: {
    type: DataTypes.JSON, // pl. ["noi_vagas", "balayage"]
    allowNull: false
  },
  image: {
    type: DataTypes.STRING, // URL vagy fájlnév
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

export default Staff;
