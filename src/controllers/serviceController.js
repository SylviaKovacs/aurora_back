
import Service from '../models/Service.js';

export const getServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Szolgáltatások lekérése sikertelen' });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Szolgáltatás nem található' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Szolgáltatás lekérése sikertelen' });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    if (!name || !price || !duration) {
      return res.status(400).json({ error: 'Név, ár és időtartam kötelező' });
    }

    const newService = await Service.create({ name, description, price, duration });
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ error: 'Szolgáltatás létrehozása sikertelen' });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Szolgáltatás nem található' });

    await service.update(req.body);
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: 'Szolgáltatás frissítése sikertelen' });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Szolgáltatás nem található' });

    await service.destroy();
    res.json({ message: 'Szolgáltatás törölve' });
  } catch (error) {
    res.status(500).json({ error: 'Szolgáltatás törlése sikertelen' });
  }
};
