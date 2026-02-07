
import { Op } from 'sequelize';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import NewsletterSubscribe from '../models/NewsletterSubscribe.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });

    const counts = await Appointment.findAll({
      attributes: ['userId', [Appointment.sequelize.fn('COUNT', Appointment.sequelize.col('id')), 'appointmentCount']],
      where: { userId: { [Op.ne]: null } },
      group: ['userId'],
      raw: true
    });

    const countMap = new Map(counts.map(c => [String(c.userId), Number(c.appointmentCount || 0)]));
    const enriched = users.map(u => {
      const count = countMap.get(String(u.id)) || 0;
      return {
        ...u.toJSON(),
        appointmentCount: count,
        hasAppointments: count > 0
      };
    });

    res.json(enriched);
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

export const getUserAppointments = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!userId) return res.status(400).json({ error: 'Érvénytelen felhasználó' });

    const appointments = await Appointment.findAll({
      where: { userId },
      order: [['date', 'ASC'], ['time', 'ASC']]
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Foglalások lekérése sikertelen' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const isOwner = Number(targetId) === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Nincs jogosultság a módosításra' });

    const user = await User.findByPk(targetId);
    if (!user) return res.status(404).json({ error: 'Felhasználó nem található' });

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
      active,
      blacklisted,
      blacklistReason
    } = req.body;

    if (role && !isAdmin) return res.status(403).json({ error: 'Szerepkör módosítás csak adminnak engedélyezett' });
    if (active !== undefined && !isAdmin) return res.status(403).json({ error: 'Aktív státusz módosítás csak adminnak engedélyezett' });
    if (blacklisted !== undefined && !isAdmin) return res.status(403).json({ error: 'Feketelista módosítás csak adminnak engedélyezett' });
    if (blacklistReason !== undefined && !isAdmin) return res.status(403).json({ error: 'Feketelista indok módosítás csak adminnak engedélyezett' });

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
    if (blacklisted !== undefined) updatePayload.blacklisted = blacklisted;
    if (blacklistReason !== undefined) updatePayload.blacklistReason = blacklistReason;

    if (newsletter !== undefined) {
      updatePayload.newsletter = newsletter;
    } else if (newsletter_optin !== undefined) {
      updatePayload.newsletter = newsletter_optin;
    }

    if (updatePayload.blacklisted === true) {
      if (!updatePayload.blacklistedAt) {
        updatePayload.blacklistedAt = new Date();
      }
      if (updatePayload.blacklistReason === undefined && user.blacklistReason) {
        updatePayload.blacklistReason = user.blacklistReason;
      }
    }

    if (updatePayload.blacklisted === false) {
      updatePayload.blacklistedAt = null;
      updatePayload.blacklistReason = null;
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
    res.status(400).json({ error: 'Felhasználó frissítése sikertelen' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Törlés csak adminnak engedélyezett' });

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Felhasználó nem található' });

    await user.update({ active: false });
    res.json({ message: 'Felhasználó archiválva' });
  } catch (error) {
    res.status(500).json({ error: 'Felhasználó törlése sikertelen' });
  }
};
