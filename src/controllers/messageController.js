
﻿import ContactMessage from '../models/ContactMessage.js';

const sendEmailNotification = async (payload) => {
  const { name, email, message } = payload;
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    CONTACT_NOTIFY_EMAIL
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_NOTIFY_EMAIL) {
    return;
  }

  let nodemailer;
  try {
    nodemailer = await import('nodemailer');
  } catch {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: SMTP_USER,
    to: CONTACT_NOTIFY_EMAIL,
    subject: `Új kapcsolatfelvétel: ${name}`,
    text: `Név: ${name}\nEmail: ${email}\n\nÜzenet:\n${message}`
  });
};

export const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Minden mező kötelező' });
    }

    const saved = await ContactMessage.create({ name, email, message });
    sendEmailNotification({ name, email, message }).catch(() => {});
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: 'Üzenet küldése sikertelen' });
  }
};

export const getMessages = async (_req, res) => {
  try {
    const messages = await ContactMessage.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Üzenetek lekérése sikertelen' });
  }
};

export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['new', 'read'].includes(status)) {
      return res.status(400).json({ error: 'Érvénytelen státusz' });
    }

    const message = await ContactMessage.findByPk(id);
    if (!message) return res.status(404).json({ error: 'Üzenet nem található' });

    await message.update({ status });
    res.json(message);
  } catch (error) {
    res.status(400).json({ error: 'Státusz frissítése sikertelen' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: 'Üzenet nem található' });

    await message.destroy();
    res.json({ message: 'Üzenet törölve' });
  } catch (error) {
    res.status(500).json({ error: 'Üzenet törlése sikertelen' });
  }
};
