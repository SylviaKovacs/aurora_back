import Review from '../models/Review.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

const isPastAppointment = (appointment) => {
  if (!appointment?.date) return false;
  const date = new Date(`${appointment.date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date <= today;
};

export const listReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({ order: [['createdAt', 'DESC']] });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Ertekelesek lekerese sikertelen' });
  }
};

export const listPublicReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { status: 'approved' },
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Ertekelesek lekerese sikertelen' });
  }
};

export const getReviewByAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findOne({ where: { appointmentId: id } });
    res.json(review || null);
  } catch (error) {
    res.status(500).json({ error: 'Ertekeles lekerese sikertelen' });
  }
};

export const createReview = async (req, res) => {
  try {
    const { appointmentId, rating, comment, email } = req.body;
    if (!appointmentId || !rating) {
      return res.status(400).json({ error: 'Idopont es ertekeles kotelezo' });
    }

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Idopont nem talalhato' });
    }

    const existing = await Review.findOne({ where: { appointmentId } });
    if (existing) {
      return res.status(409).json({ error: 'Ertekeles mar letezik' });
    }

    if (!isPastAppointment(appointment)) {
      return res.status(400).json({ error: 'Ertekeles csak idopont utan kuldheto' });
    }

    let userId = null;
    if (req.user?.id) {
      const user = await User.findByPk(req.user.id);
      if (user && (appointment.userId === user.id || appointment.email === user.email)) {
        userId = user.id;
      }
    } else if (email && appointment.email === email) {
      userId = appointment.userId ?? null;
    } else {
      return res.status(403).json({ error: 'Nincs jogosultsag' });
    }

    const safeRating = Math.max(1, Math.min(5, Number(rating)));
    const review = await Review.create({
      appointmentId,
      userId,
      staffId: appointment.staffId ?? null,
      serviceKey: appointment.serviceKey ?? null,
      customerName: appointment.name,
      rating: safeRating,
      comment: comment || null,
      status: 'pending'
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: 'Ertekeles letrehozasa sikertelen' });
  }
};

export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ error: 'Ertekeles nem talalhato' });

    review.status = status || review.status;
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: 'Ertekeles frissitese sikertelen' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Ertekeles nem talalhato' });
    await review.destroy();
    res.json({ message: 'Ertekeles torolve' });
  } catch (error) {
    res.status(500).json({ error: 'Ertekeles torlese sikertelen' });
  }
};
