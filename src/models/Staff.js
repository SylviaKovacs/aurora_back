
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

User.hasOne(Staff, { foreignKey: 'userId' });
Staff.belongsTo(User, { foreignKey: 'userId' });

export default Staff;
