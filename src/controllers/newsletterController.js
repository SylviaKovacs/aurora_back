import NewsletterSubscribe from '../models/NewsletterSubscribe.js';
import NewsletterCampaign from '../models/NewsletterCampaign.js';
import User from '../models/User.js';

export const subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email szükséges!' });
  }

  try {
    const existing = await NewsletterSubscribe.findOne({ where: { email } });
    if (existing) {
      return res.status(200).json({ message: 'Már fel vagy iratkozva!' });
    }

    const user = await User.findOne({ where: { email } });

    await NewsletterSubscribe.create({
      email,
      userId: user ? user.id : null
    });

    if (user) {
      user.newsletter = true;
      await user.save();
    }

    return res.status(201).json({ message: 'Sikeres feliratkozás!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Szerver hiba!' });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    const subs = await NewsletterSubscribe.findAll({ order: [['subscribedAt', 'DESC']] });
    res.json(subs);
  } catch (error) {
    res.status(500).json({ error: 'Feliratkozók lekérése sikertelen' });
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

export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await NewsletterCampaign.findAll({ order: [['createdAt', 'DESC']] });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Kampányok lekérése sikertelen' });
  }
};

const parseEmails = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(e => String(e).trim()).filter(Boolean);
  if (typeof input !== 'string') return [];
  return input
    .split(/[\s,;]+/)
    .map(e => e.trim())
    .filter(Boolean);
};

export const sendNewsletter = async (req, res) => {
  try {
    const { subject, content, recipients, recipientsText } = req.body;

    if (!subject || !content) {
      return res.status(400).json({ error: 'Tárgy és tartalom kötelező' });
    }

    const subs = await NewsletterSubscribe.findAll();
    const allEmails = subs.map(s => s.email);

    const fromText = parseEmails(recipientsText);
    const fromArray = parseEmails(recipients);
    const requested = [...fromText, ...fromArray];

    const targetEmails = requested.length
      ? Array.from(new Set(requested.filter(email => allEmails.includes(email))))
      : allEmails;

    const campaign = await NewsletterCampaign.create({
      subject,
      content,
      recipients: targetEmails,
      recipientsCount: targetEmails.length,
      status: 'saved',
      sentAt: new Date()
    });

    res.json({
      message: 'Kampány elmentve. Email küldést később kötjük be.',
      campaign
    });
  } catch (error) {
    res.status(500).json({ error: 'Hírlevél küldése sikertelen' });
  }
};
