import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const NewsletterSubscribe = sequelize.define('NewsletterSubscribe', {
  email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
  subscribedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false
});

// Kapcsolat (opcionális): ha regisztrált user iratkozik fel
User.hasMany(NewsletterSubscribe, { foreignKey: 'userId' });
NewsletterSubscribe.belongsTo(User, { foreignKey: 'userId' });

export default NewsletterSubscribe;
