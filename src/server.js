
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import { DataTypes } from 'sequelize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
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
import { startReminderScheduler } from './utils/reminders.js';
import NewsletterSubscribe from './models/NewsletterSubscribe.js';
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
const isProd = process.env.NODE_ENV === 'production';
const requireEnv = (key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
};

requireEnv('JWT_SECRET');
if (isProd) {
  requireEnv('SESSION_SECRET');
} else if (!process.env.SESSION_SECRET) {
  console.warn('Figyelem: SESSION_SECRET nincs beállítva (dev mód), JWT_SECRET lesz használva.');
}

const configuredOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const devDefaultOrigins = [
  'http://localhost:4200',
  'http://127.0.0.1:4200',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

const allowedOrigins = isProd
  ? configuredOrigins
  : Array.from(new Set([...configuredOrigins, ...devDefaultOrigins]));

const allowAllOrigins = !isProd && configuredOrigins.length === 0;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowAllOrigins) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS tiltott origin'), false);
  }
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false
});

const bookingLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});

const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

configurePassport();

app.use('/api/users', userRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/appointments', bookingLimiter, appointmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentLimiter, paymentRoutes);

app.use(errorHandler);

const ensureUserColumns = async () => {
  const qi = sequelize.getQueryInterface();
  try {
    const table = await qi.describeTable('Users');
    if (!table.blacklisted) {
      await qi.addColumn('Users', 'blacklisted', {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      });
    }
    if (!table.blacklistReason) {
      await qi.addColumn('Users', 'blacklistReason', {
        type: DataTypes.STRING,
        allowNull: true
      });
    }
    if (!table.blacklistedAt) {
      await qi.addColumn('Users', 'blacklistedAt', {
        type: DataTypes.DATE,
        allowNull: true
      });
    }
    if (!table.refreshTokenHash) {
      await qi.addColumn('Users', 'refreshTokenHash', {
        type: DataTypes.STRING,
        allowNull: true
      });
    }
    if (!table.refreshTokenExpiresAt) {
      await qi.addColumn('Users', 'refreshTokenExpiresAt', {
        type: DataTypes.DATE,
        allowNull: true
      });
    }
    if (!table.resetPasswordTokenHash) {
      await qi.addColumn('Users', 'resetPasswordTokenHash', {
        type: DataTypes.STRING,
        allowNull: true
      });
    }
    if (!table.resetPasswordExpiresAt) {
      await qi.addColumn('Users', 'resetPasswordExpiresAt', {
        type: DataTypes.DATE,
        allowNull: true
      });
    }
  } catch (err) {
    console.error('User oszlopok ellenorzese sikertelen:', err);
  }
};

const ensureNewsletterSubscribeColumns = async () => {
  const qi = sequelize.getQueryInterface();
  const tableName = NewsletterSubscribe.getTableName();

  try {
    const table = await qi.describeTable(tableName);
    if (!table.userId) {
      await qi.addColumn(tableName, 'userId', {
        type: DataTypes.INTEGER,
        allowNull: true
      });
    }
  } catch (err) {
    console.error('NewsletterSubscribe oszlopok ellenorzese sikertelen:', err);
  }
};

sequelize.sync()
  .then(async () => {
    await ensureUserColumns();
    await ensureNewsletterSubscribeColumns();
    console.log('Adatbázis szinkronizálva');
    startReminderScheduler();
    app.listen(PORT, () => {
      console.log(`Szerver fut a ${PORT} porton`);
    });
  })
  .catch(err => {
    console.error('Szinkronizálási hiba:', err);
  });
