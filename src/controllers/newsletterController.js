import { DataTypes } from 'sequelize';
import jwt from 'jsonwebtoken';
import sequelize from '../config/db.js';
import NewsletterSubscribe from '../models/NewsletterSubscribe.js';
import NewsletterCampaign from '../models/NewsletterCampaign.js';
import User from '../models/User.js';
import { isEmailConfigured, sendEmail } from '../utils/notifications.js';

const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const parseEmails = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((e) => String(e).trim()).filter(Boolean);
  if (typeof input !== 'string') return [];
  return input
    .split(/[\s,;]+/)
    .map((e) => e.trim())
    .filter(Boolean);
};

let ensureUserIdColumnPromise = null;

const ensureSubscriberUserIdColumn = async () => {
  if (!ensureUserIdColumnPromise) {
    ensureUserIdColumnPromise = (async () => {
      const qi = sequelize.getQueryInterface();
      const tableName = NewsletterSubscribe.getTableName();
      const table = await qi.describeTable(tableName);
      if (!table.userId) {
        try {
          await qi.addColumn(tableName, 'userId', {
            type: DataTypes.INTEGER,
            allowNull: true
          });
        } catch (error) {
          if (error?.original?.code !== 'ER_DUP_FIELDNAME') {
            throw error;
          }
        }
      }
    })().catch((error) => {
      ensureUserIdColumnPromise = null;
      throw error;
    });
  }
  await ensureUserIdColumnPromise;
};

const syncSubscribersFromUsers = async () => {
  await ensureSubscriberUserIdColumn();

  const users = await User.findAll({
    where: { newsletter: true },
    attributes: ['id', 'email']
  });
  if (!users.length) return;

  const existing = await NewsletterSubscribe.findAll({ attributes: ['email'] });
  const existingSet = new Set(existing.map((s) => normalizeEmail(s.email)));

  const toInsert = users
    .map((u) => ({ userId: u.id, email: normalizeEmail(u.email) }))
    .filter((u) => u.email && !existingSet.has(u.email));

  if (toInsert.length === 0) return;
  await NewsletterSubscribe.bulkCreate(toInsert);
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

const wrapNewsletterHtml = (content, unsubscribeUrl) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <div style="padding: 16px 0;">${content.replace(/\n/g, '<br>')}</div>
    <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
    <div style="font-size: 12px; color: #777;">
      Ha nem szeretnel tobb hirlevelet kapni, leiratkozas:
      <a href="${unsubscribeUrl}">${unsubscribeUrl}</a>
    </div>
  </div>
`;

export const subscribe = async (req, res) => {
  const { email } = req.body || {};
  const normalized = normalizeEmail(email);

  if (!normalized) {
    return res.status(400).json({ message: 'Email szukseges!' });
  }
  if (!isEmail(normalized)) {
    return res.status(400).json({ message: 'Ervenytelen email cim!' });
  }

  try {
    await ensureSubscriberUserIdColumn();

    const existing = await NewsletterSubscribe.findOne({ where: { email: normalized } });
    if (existing) {
      return res.status(200).json({ message: 'Mar fel vagy iratkozva!' });
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

    return res.status(201).json({ message: 'Sikeres feliratkozas!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Szerver hiba!' });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    await syncSubscribersFromUsers();
    const subs = await NewsletterSubscribe.findAll({ order: [['subscribedAt', 'DESC']] });
    return res.json(subs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Feliratkozok lekerese sikertelen' });
  }
};

export const deleteSubscriber = async (req, res) => {
  try {
    await ensureSubscriberUserIdColumn();
    const sub = await NewsletterSubscribe.findByPk(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Feliratkozo nem talalhato' });

    await sub.destroy();
    return res.json({ message: 'Feliratkozo torolve' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Feliratkozo torlese sikertelen' });
  }
};

export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await NewsletterCampaign.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(campaigns);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Kampanyok lekerese sikertelen' });
  }
};

export const importSubscribers = async (req, res) => {
  try {
    await ensureSubscriberUserIdColumn();

    const { emails, emailsText } = req.body || {};
    const parsed = [
      ...parseEmails(emailsText),
      ...parseEmails(emails)
    ];
    const normalized = Array.from(new Set(parsed.map(normalizeEmail).filter(isEmail)));

    if (normalized.length === 0) {
      return res.status(400).json({ error: 'Nincs ervenyes email a listaban' });
    }

    const existing = await NewsletterSubscribe.findAll({ where: { email: normalized } });
    const existingSet = new Set(existing.map((e) => normalizeEmail(e.email)));
    const toInsert = normalized.filter((emailValue) => !existingSet.has(emailValue));

    if (toInsert.length > 0) {
      const users = await User.findAll({ where: { email: toInsert } });
      const userMap = new Map(users.map((u) => [normalizeEmail(u.email), u.id]));
      await NewsletterSubscribe.bulkCreate(
        toInsert.map((emailValue) => ({
          email: emailValue,
          userId: userMap.get(emailValue) || null
        }))
      );
    }

    return res.json({
      total: normalized.length,
      added: toInsert.length,
      skipped: normalized.length - toInsert.length
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Importalas sikertelen' });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    await ensureSubscriberUserIdColumn();

    const token = req.query?.token;
    if (!token) {
      return res.status(400).send('Hianyzo token.');
    }

    let payload;
    try {
      payload = jwt.verify(String(token), process.env.JWT_SECRET);
    } catch {
      return res.status(400).send('Ervenytelen vagy lejart token.');
    }

    if (!payload || payload.type !== 'newsletter_unsub' || !payload.email) {
      return res.status(400).send('Ervenytelen token.');
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

    return res.send('Sikeres leiratkozas.');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Leiratkozas sikertelen.');
  }
};

export const sendNewsletter = async (req, res) => {
  try {
    const { subject, content, recipients, recipientsText } = req.body || {};

    if (!subject || !content) {
      return res.status(400).json({ error: 'Targy es tartalom kotelezo' });
    }
    if (!isEmailConfigured()) {
      return res.status(500).json({ error: 'SMTP nincs beallitva, a hirlevel kuldes nem elerheto.' });
    }

    await syncSubscribersFromUsers();
    const subs = await NewsletterSubscribe.findAll();
    const allEmails = subs.map((s) => normalizeEmail(s.email));

    const fromText = parseEmails(recipientsText);
    const fromArray = parseEmails(recipients);
    const requested = [...fromText, ...fromArray];

    const targetEmails = requested.length
      ? Array.from(new Set(
        requested
          .map(normalizeEmail)
          .filter((emailValue) => allEmails.includes(emailValue))
      ))
      : allEmails;

    if (targetEmails.length === 0) {
      return res.status(400).json({ error: 'Nincs cimzett' });
    }

    const sentEmails = [];
    const failedEmails = [];

    for (const emailValue of targetEmails) {
      const unsubscribeUrl = buildUnsubscribeLink(emailValue);
      const html = wrapNewsletterHtml(content, unsubscribeUrl);
      const text = `${content}\n\nLeiratkozas: ${unsubscribeUrl}`;
      const result = await sendEmail(emailValue, subject, text, html);
      if (result?.ok) {
        sentEmails.push(emailValue);
      } else {
        failedEmails.push(emailValue);
      }
    }

    const campaign = await NewsletterCampaign.create({
      subject,
      content,
      recipients: sentEmails,
      recipientsCount: sentEmails.length,
      status: failedEmails.length > 0 ? (sentEmails.length > 0 ? 'partial' : 'failed') : 'sent',
      sentAt: new Date()
    });

    if (sentEmails.length === 0) {
      return res.status(502).json({
        error: 'A hirlevel kuldes sikertelen. Ellenorizd az SMTP beallitasokat.',
        failed: failedEmails.length
      });
    }

    return res.json({
      message: failedEmails.length > 0
        ? `Hirlevel reszben elkuldve. Sikeres: ${sentEmails.length}, sikertelen: ${failedEmails.length}.`
        : 'Hirlevel elkuldve.',
      sent: sentEmails.length,
      failed: failedEmails.length,
      campaign
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Hirlevel kuldese sikertelen' });
  }
};
