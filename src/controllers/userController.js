import NewsletterSubscribe from '../models/NewsletterSubscribe.js';
import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Felhasználók lekérése sikertelen' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ error: 'Felhasználó nem található' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Saját profil lekérése sikertelen' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ error: 'Felhasználó nem található' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Felhasználó lekérése sikertelen' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const isOwner = Number(targetId) === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Nincs jogosultság a módosításhoz' });

    const user = await User.findByPk(targetId);
    if (!user) return res.status(404).json({ error: 'Felhasználó nem található' });

    const { name, email, newsletter_optin, role } = req.body;
    if (role && !isAdmin) return res.status(403).json({ error: 'Szerepkör módosítása csak adminnak engedélyezett' });

    await user.update({ name, email, NewsletterSubscribe, role });
    const sanitized = user.toJSON();
    delete sanitized.password;
    res.json(sanitized);
  } catch (error) {
    res.status(400).json({ error: 'Felhasználó frissítése sikertelen' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Törlés csak adminnak engedélyezett' });

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Felhasználó nem található' });

    await user.destroy();
    res.json({ message: 'Felhasználó törölve' });
  } catch (error) {
    res.status(500).json({ error: 'Felhasználó törlése sikertelen' });
  }
};
