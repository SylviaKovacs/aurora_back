
﻿import express from 'express';
import passport, { isOAuthConfigured } from '../config/passport.js';
import { register, login, refreshToken, forgotPassword, resetPassword, oauthSuccess, oauthFailed } from '../controllers/authController.js';

const router = express.Router();
const requireOAuth = (req, res, next) => {
  if (!isOAuthConfigured()) {
    return res.status(501).json({ error: 'OAuth nincs konfigurálva' });
  }
  return next();
};

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/oauth-failed', oauthFailed);

router.get('/google', requireOAuth, passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  requireOAuth,
  passport.authenticate('google', { failureRedirect: '/api/auth/oauth-failed' }),
  oauthSuccess
);

router.get('/facebook', requireOAuth, passport.authenticate('facebook', { scope: ['email'] }));
router.get(
  '/facebook/callback',
  requireOAuth,
  passport.authenticate('facebook', { failureRedirect: '/api/auth/oauth-failed' }),
  oauthSuccess
);

export default router;
