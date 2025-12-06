import NewsletterSubscribe from '../models/NewsletterSubscribe.js';

export const getSubscribers = async (req, res) => {
  try {
    const subs = await NewsletterSubscribe.findAll();
    res.json(subs);
  } catch (error) {
    res.status(500).json({ error: 'Feliratkozók lekérése sikertelen' });
  }
};

export const createSubscriber = async (req, res) => {
  try {
    const { email, userId } = req.body;
    if (!email) return res.status(400).json({ error: 'Email kötelező' });

    const existing = await NewsletterSubscribe.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Ez az email már feliratkozott' });

    const sub = await NewsletterSubscribe.create({ email, userId });
    res.status(201).json(sub);
  } catch (error) {
    res.status(400).json({ error: 'Feliratkozás sikertelen' });
  }
};

export const deleteSubscriber = async (req, res) => {
  try {
    const sub = await NewsletterSubscribe.findByPk(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Feliratkozó nem található' });

    await sub.destroy();
    res.json({ message: 'Feliratkozó törölve' });
  } catch (error) {
    res.status(500).json({ error: 'Feliratkozó törlése sikertelen' });
  }
};
