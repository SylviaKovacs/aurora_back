import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || smtpUser || 'no-reply@example.com';
const adminNotifyEmail = process.env.ADMIN_NOTIFY_EMAIL;
const smsWebhookUrl = process.env.SMS_WEBHOOK_URL;

let transporter = null;

const getTransporter = () => {
  if (!smtpHost || !smtpUser || !smtpPass) return null;
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });
  return transporter;
};

const baseText = (a) => {
  return [
    `Nev: ${a.name}`,
    `Szolgaltatas: ${a.serviceLabel}`,
    `Szakember: ${a.staffName || 'Nincs megadva'}`,
    `Datum: ${a.date}`,
    `Ido: ${a.time}`,
    `Ar: ${a.price || 0} Ft`
  ].join('\n');
};

const templates = {
  created: (a) => ({
    subject: 'Idopont foglalas visszaigazolas',
    text: `Sikeres idopontfoglalas.\n\n${baseText(a)}`,
    html: `<p>Sikeres idopontfoglalas.</p><pre>${baseText(a)}</pre>`
  }),
  updated: (a) => ({
    subject: 'Idopont modositas',
    text: `Az idopontod modosult.\n\n${baseText(a)}`,
    html: `<p>Az idopontod modosult.</p><pre>${baseText(a)}</pre>`
  }),
  status: (a) => ({
    subject: 'Idopont statusz frissites',
    text: `Az idopont statusza: ${a.status}\n\n${baseText(a)}`,
    html: `<p>Az idopont statusza: <strong>${a.status}</strong></p><pre>${baseText(a)}</pre>`
  })
};

export const sendEmail = async (to, subject, text, html) => {
  const mailer = getTransporter();
  if (!mailer) return;
  try {
    await mailer.sendMail({
      from: smtpFrom,
      to,
      subject,
      text,
      html
    });
  } catch {
    // no-op
  }
};

export const sendSms = async (to, message) => {
  if (!smsWebhookUrl) return;
  try {
    await fetch(smsWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message })
    });
  } catch {
    // no-op
  }
};

export const notifyAppointmentCreated = async (appointment) => {
  const t = templates.created(appointment);
  if (appointment.email) {
    await sendEmail(appointment.email, t.subject, t.text, t.html);
  }
  if (adminNotifyEmail) {
    await sendEmail(adminNotifyEmail, `[ADMIN] ${t.subject}`, t.text, t.html);
  }
  if (appointment.phone) {
    await sendSms(appointment.phone, `${t.subject} - ${appointment.date} ${appointment.time}`);
  }
};

export const notifyAppointmentUpdated = async (appointment) => {
  const t = templates.updated(appointment);
  if (appointment.email) {
    await sendEmail(appointment.email, t.subject, t.text, t.html);
  }
  if (adminNotifyEmail) {
    await sendEmail(adminNotifyEmail, `[ADMIN] ${t.subject}`, t.text, t.html);
  }
  if (appointment.phone) {
    await sendSms(appointment.phone, `${t.subject} - ${appointment.date} ${appointment.time}`);
  }
};

export const notifyAppointmentStatus = async (appointment) => {
  const t = templates.status(appointment);
  if (appointment.email) {
    await sendEmail(appointment.email, t.subject, t.text, t.html);
  }
  if (adminNotifyEmail) {
    await sendEmail(adminNotifyEmail, `[ADMIN] ${t.subject}`, t.text, t.html);
  }
  if (appointment.phone) {
    await sendSms(appointment.phone, `Statusz: ${appointment.status} - ${appointment.date} ${appointment.time}`);
  }
};
