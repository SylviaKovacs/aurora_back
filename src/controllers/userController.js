import User from '../models/User.js';
import NewsletterSubscribe from '../models/NewsletterSubscribe.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Felhasznalok lekerese sikertelen' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ error: 'Felhasznalo nem talalhato' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Sajat profil lekerese sikertelen' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ error: 'Felhasznalo nem talalhato' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Felhasznalo lekerese sikertelen' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const isOwner = Number(targetId) === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Nincs jogosultsag a modositasra' });

    const user = await User.findByPk(targetId);
    if (!user) return res.status(404).json({ error: 'Felhasznalo nem talalhato' });

    const {
      name,
      email,
      phone,
      addressZip,
      addressCity,
      addressStreet,
      addressHouseNumber,
      newsletter,
      newsletter_optin,
      role,
      active
    } = req.body;
    if (role && !isAdmin) return res.status(403).json({ error: 'Szerepkor modositas csak adminnak engedelyezett' });
    if (active !== undefined && !isAdmin) return res.status(403).json({ error: 'Aktiv statusz modositas csak adminnak engedelyezett' });

    const updatePayload = {};
    if (name !== undefined) updatePayload.name = name;
    if (email !== undefined) updatePayload.email = email;
    if (phone !== undefined) updatePayload.phone = phone;
    if (addressZip !== undefined) updatePayload.addressZip = addressZip;
    if (addressCity !== undefined) updatePayload.addressCity = addressCity;
    if (addressStreet !== undefined) updatePayload.addressStreet = addressStreet;
    if (addressHouseNumber !== undefined) updatePayload.addressHouseNumber = addressHouseNumber;
    if (role !== undefined) updatePayload.role = role;
    if (active !== undefined) updatePayload.active = active;

    if (newsletter !== undefined) {
      updatePayload.newsletter = newsletter;
    } else if (newsletter_optin !== undefined) {
      updatePayload.newsletter = newsletter_optin;
    }

    await user.update(updatePayload);

    if (updatePayload.newsletter === true && user.email) {
      const existing = await NewsletterSubscribe.findOne({ where: { email: user.email } });
      if (!existing) {
        await NewsletterSubscribe.create({
          email: user.email,
          userId: user.id
        });
      }
    }

    if (updatePayload.newsletter === false && user.email) {
      await NewsletterSubscribe.destroy({ where: { email: user.email } });
    }

    const sanitized = user.toJSON();
    delete sanitized.password;
    res.json(sanitized);
  } catch (error) {
    res.status(400).json({ error: 'Felhasznalo frissitese sikertelen' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Torles csak adminnak engedelyezett' });

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Felhasznalo nem talalhato' });

    await user.update({ active: false });
    res.json({ message: 'Felhasznalo archiválva' });
  } catch (error) {
    res.status(500).json({ error: 'Felhasznalo torlese sikertelen' });
  }
};
