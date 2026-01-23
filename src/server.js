import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import sequelize from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import passport, { configurePassport } from './config/passport.js';
import './models/User.js';
import './models/Staff.js';
import './models/ContactMessage.js';
import './models/NewsletterCampaign.js';
import './models/BlockedSlot.js';
import './models/AuditLog.js';
import './models/Coupon.js';
import './models/Review.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'change_me',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

configurePassport();

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);

app.use(errorHandler);

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Adatbazis szinkronizalva');
    app.listen(PORT, () => {
      console.log(`Szerver fut a ${PORT} porton`);
    });
  })
  .catch(err => {
    console.error('Szinkronizalasi hiba:', err);
  });
