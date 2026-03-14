import Staff from '../models/Staff.js';
import User from '../models/User.js';

const normalizeEmail = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
};

const normalizeRole = (value) => {
  if (typeof value !== 'string') return '';

  return value
    .trim()
    .replace(/fodr\uFFFDsz/gi, 'fodr\u00e1sz')
    .replace(/fodr\u00c3\u00a1sz/gi, 'fodr\u00e1sz')
    .replace(/fodr\u0102\u02c7sz/gi, 'fodr\u00e1sz');
};

const normalizeStaffRecord = (record) => {
  const data = typeof record?.toJSON === 'function' ? record.toJSON() : record;
  return {
    ...data,
    role: normalizeRole(data?.role)
  };
};

export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'role']
      }]
    });
    res.json(staff.map(normalizeStaffRecord));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Szakemberek lekerese sikertelen' });
  }
};

export const getPublicStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll({
      where: { active: true },
      attributes: ['id', 'name', 'role', 'services', 'image', 'active']
    });
    res.json(staff.map(normalizeStaffRecord));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Szakemberek lekerese sikertelen' });
  }
};

export const createStaff = async (req, res) => {
  try {
    const { name, role, services, image, userId, userEmail, userRole } = req.body;
    const normalizedRole = normalizeRole(role);
    const normalizedEmail = normalizeEmail(userEmail);

    if (!String(name || '').trim() || !normalizedRole) {
      return res.status(400).json({ error: 'Nev es szerep kotelezo' });
    }

    let resolvedUserId = userId ?? null;
    if (!resolvedUserId && normalizedEmail) {
      const linkedUser = await User.findOne({ where: { email: normalizedEmail } });
      if (!linkedUser) {
        return res.status(400).json({ error: 'A megadott emailhez nem talalhato felhasznalo' });
      }
      resolvedUserId = linkedUser.id;
    }

    const staff = await Staff.create({
      name,
      role: normalizedRole,
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
    console.error(error);
    res.status(400).json({ error: 'Szakember letrehozasa sikertelen' });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) return res.status(404).json({ error: 'Szakember nem talalhato' });

    const { userId, userEmail, userRole, ...rest } = req.body;
    const normalizedEmail = normalizeEmail(userEmail);
    const payload = { ...rest };

    if (payload.role !== undefined) {
      payload.role = normalizeRole(payload.role);
      if (!payload.role) {
        return res.status(400).json({ error: 'A szerep nem lehet ures' });
      }
    }

    let resolvedUserId = userId;
    if (!resolvedUserId && normalizedEmail) {
      const linkedUser = await User.findOne({ where: { email: normalizedEmail } });
      if (!linkedUser) {
        return res.status(400).json({ error: 'A megadott emailhez nem talalhato felhasznalo' });
      }
      resolvedUserId = linkedUser.id;
    }

    await staff.update({ ...payload, userId: resolvedUserId ?? staff.userId });

    if (resolvedUserId) {
      const nextRole = userRole || 'staff';
      await User.update({ role: nextRole }, { where: { id: resolvedUserId } });
    }

    const refreshed = await Staff.findByPk(staff.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email', 'role'] }]
    });
    res.json(normalizeStaffRecord(refreshed || staff));
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Szakember frissitese sikertelen' });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) return res.status(404).json({ error: 'Szakember nem talalhato' });

    await staff.destroy();
    res.json({ message: 'Szakember torolve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Szakember torlese sikertelen' });
  }
};
