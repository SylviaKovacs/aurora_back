import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../src/config/db.js';
import Staff from '../src/models/Staff.js';
import User from '../src/models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const FIXED_PASSWORD = process.env.STAFF_PASSWORD || null;

const normalizeName = (value) => {
  if (!value) return 'staff';
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim() || 'staff';
};

const buildUniqueEmail = async (base) => {
  let email = `${base}@aurora.hu`;
  let suffix = 1;
  while (await User.findOne({ where: { email } })) {
    email = `${base}${suffix}@aurora.hu`;
    suffix += 1;
  }
  return email;
};

const ensurePassword = async (user) => {
  if (!FIXED_PASSWORD && user.password) return null;
  const raw = FIXED_PASSWORD || `Aurora${Math.floor(100000 + Math.random() * 900000)}`;
  const hashed = await bcrypt.hash(raw, 10);
  await user.update({ password: hashed });
  return raw;
};

const run = async () => {
  await sequelize.authenticate();

  const staffMembers = await Staff.findAll();
  const results = [];

  for (const staff of staffMembers) {
    await staff.update({ active: true });

    const firstName = String(staff.name || '').split(' ')[0] || staff.name || 'staff';
    const base = normalizeName(firstName);
    let user = null;

    if (staff.userId) {
      user = await User.scope('withPassword').findByPk(staff.userId);
    }

    if (!user) {
      const email = await buildUniqueEmail(base);
      const rawPassword = FIXED_PASSWORD || `Aurora${Math.floor(100000 + Math.random() * 900000)}`;
      const hashed = await bcrypt.hash(rawPassword, 10);
      user = await User.create({
        name: staff.name,
        email,
        password: hashed,
        role: 'staff',
        active: true
      });
      await staff.update({ userId: user.id });
      results.push({ name: staff.name, email, password: rawPassword, action: 'created' });
      continue;
    }

    const targetEmail = await buildUniqueEmail(base);
    await user.update({ role: 'staff', active: true, email: targetEmail });
    await staff.update({ userId: user.id });
    const password = await ensurePassword(user);
    results.push({ name: staff.name, email: targetEmail, password, action: 'updated' });
  }

  console.log('STAFF USERS UPDATED');
  results.forEach((r) => {
    console.log(`${r.name} -> ${r.email} (${r.action})${r.password ? ` | temp password: ${r.password}` : ''}`);
  });

  await sequelize.close();
};

run().catch(async (err) => {
  console.error(err);
  await sequelize.close();
  process.exit(1);
});
