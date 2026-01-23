import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const getFrontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:4200';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '2h';

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, newsletter } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Minden mező kötelező' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'A jelszavak nem egyeznek' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Ez az email már regisztrálva van' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      newsletter
    });

    const sanitized = user.toJSON();
    delete sanitized.password;

    return res.status(201).json({
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});


  } catch (error) {
    console.error('Regisztrációs hiba:', error);
    return res.status(500).json({ error: 'Regisztráció sikertelen' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email és jelszó kötelező' });
    }

    const user = await User.scope('withPassword').findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Felhasználó nem található' });
    }

    if (user.active === false) {
      return res.status(403).json({ error: 'A felhasználó archiválva van' });
    }

    if (!user.password) {
      return res.status(401).json({ error: 'Ehhez az emailhez social bejelentkezés tartozik' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Hibás jelszó' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: jwtExpiresIn }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Bejelentkezési hiba:', error);
    return res.status(500).json({ error: 'Bejelentkezés sikertelen' });
  }
};

export const oauthSuccess = (req, res) => {
  if (!req.user) {
    return res.redirect(`${getFrontendUrl()}/main/oauth-callback?error=oauth_failed`);
  }

  const token = jwt.sign(
    { id: req.user.id, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: jwtExpiresIn }
  );

  return res.redirect(`${getFrontendUrl()}/main/oauth-callback?token=${token}`);
};

export const oauthFailed = (req, res) => {
  return res.redirect(`${getFrontendUrl()}/main/oauth-callback?error=oauth_failed`);
};

