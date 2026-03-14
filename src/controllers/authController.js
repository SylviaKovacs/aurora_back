
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import NewsletterSubscribe from '../models/NewsletterSubscribe.js';
import { sendEmail } from '../utils/notifications.js';

const getFrontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:4200';
const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '14d';
const resetExpiresMinutes = Number(process.env.RESET_PASSWORD_EXPIRES_MINUTES || 60);

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const issueTokens = async (user) => {
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: accessExpiresIn }
  );

  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: refreshExpiresIn }
  );

  const decoded = jwt.decode(refreshToken);
  const refreshTokenExpiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : null;
  await user.update({
    refreshTokenHash: hashToken(refreshToken),
    refreshTokenExpiresAt
  });

  return { token, refreshToken };
};

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, newsletter } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Minden mezĹ‘ kĂ¶telezĹ‘' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'A jelszavak nem egyeznek' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Ez az email mĂˇr regisztrĂˇlva van' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      newsletter
    });

    if (newsletter === true) {
      const normalizedEmail = String(user.email || '').trim().toLowerCase();
      if (normalizedEmail) {
        const existingSub = await NewsletterSubscribe.findOne({ where: { email: normalizedEmail } });
        if (!existingSub) {
          await NewsletterSubscribe.create({ email: normalizedEmail, userId: user.id });
        }
      }
    }
    const sanitized = user.toJSON();
    delete sanitized.password;

    const subject = 'Sikeres regisztrĂˇciĂł';
    const text = `Szia ${user.name}!\n\nSikeres regisztrĂˇciĂł az Aurora Beauty rendszerĂ©ben.`;
    const html = `<p>Szia <strong>${user.name}</strong>!</p><p>Sikeres regisztrĂˇciĂł az Aurora Beauty rendszerĂ©ben.</p>`;
    sendEmail(user.email, subject, text, html).catch(() => {});

    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });


  } catch (error) {
    console.error('RegisztrĂˇciĂłs hiba:', error);
    return res.status(500).json({ error: 'RegisztrĂˇciĂł sikertelen' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email Ă©s jelszĂł kĂ¶telezĹ‘' });
    }

    const user = await User.scope('withPassword').findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'FelhasznĂˇlĂł nem talĂˇlhatĂł' });
    }

    if (user.active === false) {
      return res.status(403).json({ error: 'A felhasznĂˇlĂł archivĂˇlva van' });
    }

    if (!user.password) {
      return res.status(401).json({ error: 'Ehhez az emailhez social bejelentkezĂ©s tartozik' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'HibĂˇs jelszĂł' });
    }

    const { token, refreshToken } = await issueTokens(user);

    return res.json({
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('BejelentkezĂ©si hiba:', error);
    return res.status(500).json({ error: 'BejelentkezĂ©s sikertelen' });
  }
};

export const oauthSuccess = (req, res) => {
  if (!req.user) {
    return res.redirect(`${getFrontendUrl()}/main/oauth-callback?error=oauth_failed`);
  }

  User.findByPk(req.user.id).then(async (user) => {
    if (!user) {
      return res.redirect(`${getFrontendUrl()}/main/oauth-callback?error=oauth_failed`);
    }
    const { token, refreshToken } = await issueTokens(user);
    const url = `${getFrontendUrl()}/main/oauth-callback?token=${token}&refreshToken=${refreshToken}`;
    return res.redirect(url);
  }).catch(() => {
    return res.redirect(`${getFrontendUrl()}/main/oauth-callback?error=oauth_failed`);
  });
};

export const oauthFailed = (req, res) => {
  return res.redirect(`${getFrontendUrl()}/main/oauth-callback?error=oauth_failed`);
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body || {};
    if (!token) {
      return res.status(400).json({ error: 'HiĂˇnyzĂł refresh token' });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Ă‰rvĂ©nytelen vagy lejĂˇrt refresh token' });
    }

    if (!payload || payload.type !== 'refresh') {
      return res.status(401).json({ error: 'Ă‰rvĂ©nytelen refresh token' });
    }

    const user = await User.findByPk(payload.id);
    if (!user) {
      return res.status(404).json({ error: 'FelhasznĂˇlĂł nem talĂˇlhatĂł' });
    }
    if (user.active === false) {
      return res.status(403).json({ error: 'A felhasznĂˇlĂł archivĂˇlva van' });
    }
    if (user.blacklisted === true) {
      return res.status(403).json({ error: 'A felhasznĂˇlĂł feketelistĂˇn van' });
    }

    if (!user.refreshTokenHash || user.refreshTokenHash !== hashToken(token)) {
      return res.status(401).json({ error: 'Refresh token nem egyezik' });
    }
    if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
      return res.status(401).json({ error: 'Refresh token lejĂˇrt' });
    }

    const tokens = await issueTokens(user);
    return res.json({
      token: tokens.token,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Refresh token hiba' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: 'Email k\u00f6telez\u0151' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || user.active === false || user.blacklisted === true) {
      return res.json({ message: 'Ha l\u00e9tezik a fi\u00f3k, elk\u00fcldt\u00fck a reset linket.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + resetExpiresMinutes * 60 * 1000);
    await user.update({
      resetPasswordTokenHash: hashToken(token),
      resetPasswordExpiresAt: expiresAt
    });

    const frontend = process.env.FRONTEND_URL || 'http://localhost:4200';
    const resetUrl = `${frontend}/main/reset-password?token=${token}`;
    const subject = 'Jelsz\u00f3 vissza\u00e1ll\u00edt\u00e1s';
    const text = `Kattints a linkre a jelsz\u00f3 vissza\u00e1ll\u00edt\u00e1s\u00e1hoz:\n${resetUrl}\n\nA link ${resetExpiresMinutes} percig \u00e9rv\u00e9nyes.`;
    const html = `<p>Kattints a linkre a jelsz\u00f3 vissza\u00e1ll\u00edt\u00e1s\u00e1hoz:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>A link ${resetExpiresMinutes} percig \u00e9rv\u00e9nyes.</p>`;
    await sendEmail(user.email, subject, text, html);

    return res.json({ message: 'Ha l\u00e9tezik a fi\u00f3k, elk\u00fcldt\u00fck a reset linket.' });
  } catch (error) {
    return res.status(500).json({ error: 'Jelsz\u00f3 reset k\u00e9r\u00e9s sikertelen' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body || {};
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Minden mez\u0151 k\u00f6telez\u0151' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'A jelszavak nem egyeznek' });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ error: 'A jelsz\u00f3 minimum 8 karakter' });
    }

    const tokenHash = hashToken(token);
    const user = await User.findOne({
      where: { resetPasswordTokenHash: tokenHash }
    });
    if (!user || !user.resetPasswordExpiresAt || user.resetPasswordExpiresAt < new Date()) {
      return res.status(400).json({ error: '\u00c9rv\u00e9nytelen vagy lej\u00e1rt token' });
    }
    if (user.active === false) {
      return res.status(403).json({ error: 'A felhaszn\u00e1l\u00f3 archiv\u00e1lva van' });
    }
    if (user.blacklisted === true) {
      return res.status(403).json({ error: 'A felhaszn\u00e1l\u00f3 feketelist\u00e1n van' });
    }

    user.password = password;
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpiresAt = null;
    user.refreshTokenHash = null;
    user.refreshTokenExpiresAt = null;
    await user.save();

    return res.json({ message: 'Jelsz\u00f3 sikeresen friss\u00edtve' });
  } catch (error) {
    return res.status(500).json({ error: 'Jelsz\u00f3 vissza\u00e1ll\u00edt\u00e1s sikertelen' });
  }
};


