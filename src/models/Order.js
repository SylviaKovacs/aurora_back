import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Product from './Product.js';

const Order = sequelize.define('Order', {
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  status: { 
    type: DataTypes.ENUM('pending', 'paid', 'cancelled'), 
    defaultValue: 'pending' 
  }
}, {
  timestamps: true
});

// Kapcsolatok
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Order, { foreignKey: 'productId' });
Order.belongsTo(Product, { foreignKey: 'productId' });

export default Order;
