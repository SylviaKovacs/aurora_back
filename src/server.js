import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import './models/User.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import orderItemRoutes from './routes/orderItemRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import staffRoutes from './routes/staffRoutes.js';
import './models/Staff.js';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000; // ✅ EZ HIÁNYZOTT
app.use(cors());
app.use(express.json());
app.use(errorHandler);

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/staff', staffRoutes);

sequelize.sync({ alter: true }) // vagy { force: true } ha teljesen újra akarod generálni
  .then(() => {
    console.log('Adatbázis szinkronizálva');
    app.listen(PORT, () => {
      console.log(`Szerver fut a ${PORT} porton`);
    });
  })
  .catch(err => {
    console.error('Szinkronizálási hiba:', err);
  });

