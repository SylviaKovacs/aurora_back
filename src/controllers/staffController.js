
import Staff from '../models/Staff.js';
import User from '../models/User.js';

export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'role']
      }]
    });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Szakemberek lekérése sikertelen' });
  }
};

export const getPublicStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll({
      where: { active: true },
      attributes: ['id', 'name', 'role', 'services', 'image', 'active']
    });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Szakemberek lekérése sikertelen' });
  }
};

export const createStaff = async (req, res) => {
  try {
    const { name, role, services, image, userId, userEmail, userRole } = req.body;

    let resolvedUserId = userId ?? null;
    if (!resolvedUserId && userEmail) {
      const linkedUser = await User.findOne({ where: { email: userEmail } });
      if (!linkedUser) {
        return res.status(400).json({ error: 'A megadott emailhez nem található felhasználó' });
      }
      resolvedUserId = linkedUser.id;
    }

    const staff = await Staff.create({
      name,
      role,
      services,
      image,
      userId: resolvedUserId
    });

    if (resolvedUserId) {
      const nextRole = userRole || 'staff';
      await User.update({ role: nextRole }, { where: { id: resolvedUserId } });
    }

    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ error: 'Szakember létrehozása sikertelen' });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) return res.status(404).json({ error: 'Szakember nem található' });

    const { userId, userEmail, userRole, ...rest } = req.body;

    let resolvedUserId = userId;
    if (!resolvedUserId && userEmail) {
      const linkedUser = await User.findOne({ where: { email: userEmail } });
      if (!linkedUser) {
        return res.status(400).json({ error: 'A megadott emailhez nem található felhasználó' });
      }
      resolvedUserId = linkedUser.id;
    }

    await staff.update({ ...rest, userId: resolvedUserId ?? staff.userId });

    if (resolvedUserId) {
      const nextRole = userRole || 'staff';
      await User.update({ role: nextRole }, { where: { id: resolvedUserId } });
    }
    res.json(staff);
  } catch (error) {
    res.status(400).json({ error: 'Szakember frissítése sikertelen' });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) return res.status(404).json({ error: 'Szakember nem található' });

    await staff.destroy();
    res.json({ message: 'Szakember törölve' });
  } catch (error) {
    res.status(500).json({ error: 'Szakember törlése sikertelen' });
  }
};
