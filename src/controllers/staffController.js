import Staff from '../models/Staff.js';

export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Szakemberek lekérése sikertelen' });
  }
};

export const createStaff = async (req, res) => {
  try {
    const { name, role, services, image } = req.body;

    const staff = await Staff.create({
      name,
      role,
      services,
      image
    });

    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ error: 'Szakember létrehozása sikertelen' });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) return res.status(404).json({ error: 'Szakember nem található' });

    await staff.update(req.body);
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
