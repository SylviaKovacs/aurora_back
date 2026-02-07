
﻿import NewsletterSubscribe from '../models/NewsletterSubscribe.js';
import NewsletterCampaign from '../models/NewsletterCampaign.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/notifications.js';

const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const parseEmails = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(e => String(e).trim()).filter(Boolean);
  if (typeof input !== 'string') return [];
  return input
    .split(/[\s,;]+/)
    .map(e => e.trim())
    .filter(Boolean);
};

const buildUnsubscribeLink = (email) => {
  const token = jwt.sign(
    { type: 'newsletter_unsub', email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  const base = process.env.BACKEND_URL || 'http://localhost:5000';
  return `${base}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
};

const wrapNewsletterHtml = (content, unsubscribeUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="padding: 16px 0;">${content.replace(/\n/g, '<br>')}</div>
      <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
      <div style="font-size: 12px; color: #777;">
        Ha nem szeretnél több hírlevelet kapni, leiratkozás:
        <a href="${unsubscribeUrl}">${unsubscribeUrl}</a>
      </div>
    </div>
  `;
};

export const subscribe = async (req, res) => {
  const { email } = req.body;
  const normalized = normalizeEmail(email);

  if (!normalized) {
    return res.status(400).json({ message: 'Email szükséges!' });
  }
  if (!isEmail(normalized)) {
    return res.status(400).json({ message: 'Érvénytelen email cím!' });
  }

  try {
    const existing = await NewsletterSubscribe.findOne({ where: { email: normalized } });
    if (existing) {
      return res.status(200).json({ message: 'Már fel vagy iratkozva!' });
    }

    const user = await User.findOne({ where: { email: normalized } });

    await NewsletterSubscribe.create({
      email: normalized,
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

export const importSubscribers = async (req, res) => {
  try {
    const { emails, emailsText } = req.body || {};
    const parsed = [
      ...parseEmails(emailsText),
      ...parseEmails(emails)
    ];
    const normalized = Array.from(new Set(parsed.map(normalizeEmail).filter(isEmail)));

    if (normalized.length === 0) {
      return res.status(400).json({ error: 'Nincs érvényes email a listában' });
    }

    const existing = await NewsletterSubscribe.findAll({
      where: { email: normalized }
    });
    const existingSet = new Set(existing.map(e => e.email));
    const toInsert = normalized.filter(email => !existingSet.has(email));

    if (toInsert.length > 0) {
      const users = await User.findAll({ where: { email: toInsert } });
      const userMap = new Map(users.map(u => [u.email, u.id]));
      await NewsletterSubscribe.bulkCreate(
        toInsert.map(email => ({
          email,
          userId: userMap.get(email) || null
        }))
      );
    }

    return res.json({
      total: normalized.length,
      added: toInsert.length,
      skipped: normalized.length - toInsert.length
    });
  } catch (error) {
    return res.status(500).json({ error: 'Importálás sikertelen' });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const token = req.query?.token;
    if (!token) {
      return res.status(400).send('Hiányzó token.');
    }
    let payload;
    try {
      payload = jwt.verify(String(token), process.env.JWT_SECRET);
    } catch {
      return res.status(400).send('Érvénytelen vagy lejárt token.');
    }
    if (!payload || payload.type !== 'newsletter_unsub' || !payload.email) {
      return res.status(400).send('Érvénytelen token.');
    }

    const email = normalizeEmail(payload.email);
    const sub = await NewsletterSubscribe.findOne({ where: { email } });
    if (sub) {
      await sub.destroy();
    }
    const user = await User.findOne({ where: { email } });
    if (user && user.newsletter === true) {
      user.newsletter = false;
      await user.save();
    }

    return res.send('Sikeres leiratkozás.');
  } catch (error) {
    return res.status(500).send('Leiratkozás sikertelen.');
  }
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
      ? Array.from(new Set(requested.map(normalizeEmail).filter(email => allEmails.includes(email))))
      : allEmails;

    if (targetEmails.length === 0) {
      return res.status(400).json({ error: 'Nincs címzett' });
    }

    for (const email of targetEmails) {
      const unsubscribeUrl = buildUnsubscribeLink(email);
      const html = wrapNewsletterHtml(content, unsubscribeUrl);
      const text = `${content}\n\nLeiratkozás: ${unsubscribeUrl}`;
      await sendEmail(email, subject, text, html);
    }

    const campaign = await NewsletterCampaign.create({
      subject,
      content,
      recipients: targetEmails,
      recipientsCount: targetEmails.length,
      status: 'sent',
      sentAt: new Date()
    });

    res.json({
      message: 'Hírlevél elküldve.',
      campaign
    });
  } catch (error) {
    res.status(500).json({ error: 'Hírlevél küldése sikertelen' });
  }
};
