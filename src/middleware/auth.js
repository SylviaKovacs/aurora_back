
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Hiányzó vagy érvénytelen token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    User.findByPk(payload.id)
      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: 'Felhasználó nem található' });
        }
        if (user.active === false) {
          return res.status(403).json({ error: 'A felhasználó archiválva van' });
        }
        if (user.blacklisted === true) {
          return res.status(403).json({ error: 'A felhasználó feketelistán van' });
        }
        req.user = {
          id: user.id,
          role: user.role,
          email: user.email,
          name: user.name
        };
        next();
      })
      .catch(() => {
        return res.status(401).json({ error: 'Token érvénytelen vagy lejárt' });
      });
  } catch {
    return res.status(401).json({ error: 'Token érvénytelen vagy lejárt' });
  }
}
