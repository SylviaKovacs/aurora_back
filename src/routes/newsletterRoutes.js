import express from 'express';
import User from '../models/User.js';
import NewsletterSubscribe from '../models/NewsletterSubscribe.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email szükséges!' });
  }

  try {
    // Ellenőrizzük, van-e már feliratkozás
    const existing = await NewsletterSubscribe.findOne({ where: { email } });
    if (existing) {
      return res.status(200).json({ message: 'Már fel vagy iratkozva!' });
    }

    // Megnézzük, van-e regisztrált user
    const user = await User.findOne({ where: { email } });

    // Létrehozzuk a feliratkozást
    await NewsletterSubscribe.create({
      email,
      userId: user ? user.id : null
    });

    // Ha van user, frissítjük a newsletter mezőt
    if (user) {
      user.newsletter = true;
      await user.save();
    }

    return res.status(201).json({ message: 'Sikeres feliratkozás!' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Szerver hiba!' });
  }
});

export default router;
