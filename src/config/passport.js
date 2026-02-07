
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js';

let oauthConfigured = false;

const findOrCreateOAuthUser = async ({ provider, providerId, name, email }) => {
  if (!providerId) {
    throw new Error('Missing provider id');
  }
  if (!email) {
    throw new Error('Missing email from provider');
  }
  const resolvedName = (name && name.trim()) || email.split('@')[0];

  const existingByProvider = await User.findOne({
    where: { provider, providerId }
  });
  if (existingByProvider) {
    if (resolvedName && existingByProvider.name !== resolvedName) {
      await existingByProvider.update({ name: resolvedName });
    }
    return existingByProvider;
  }

  const existingByEmail = await User.findOne({ where: { email } });
  if (existingByEmail) {
    if (!existingByEmail.provider && !existingByEmail.providerId) {
      const updatePayload = { provider, providerId };
      if (resolvedName) {
        updatePayload.name = resolvedName;
      }
      await existingByEmail.update(updatePayload);
      return existingByEmail;
    }

    if (resolvedName && existingByEmail.name !== resolvedName) {
      await existingByEmail.update({ name: resolvedName });
    }
    return existingByEmail;
  }

  return User.create({
    name: resolvedName || 'Felhasznalo',
    email,
    provider,
    providerId
  });
};

// Export: configurePassport
export const configurePassport = () => {
  const required = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'FACEBOOK_APP_ID',
    'FACEBOOK_APP_SECRET',
    'OAUTH_CALLBACK_BASE_URL'
  ];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(`OAuth nincs konfigurálva. Hiányzó env: ${missing.join(', ')}`);
    return;
  }

  const buildName = (profile) => {
    const given = profile?.name?.givenName || '';
    const family = profile?.name?.familyName || '';
    const combined = `${given} ${family}`.trim();
    return combined || profile?.displayName || '';
  };

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.OAUTH_CALLBACK_BASE_URL}/api/auth/google/callback`
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || '';
          const name = buildName(profile);
          const user = await findOrCreateOAuthUser({
            provider: 'google',
            providerId: profile.id,
            name,
            email
          });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.OAUTH_CALLBACK_BASE_URL}/api/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'emails']
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || '';
          const name = buildName(profile);
          const user = await findOrCreateOAuthUser({
            provider: 'facebook',
            providerId: profile.id,
            name,
            email
          });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  oauthConfigured = true;
};

// Export: isOAuthConfigured
export const isOAuthConfigured = () => oauthConfigured;

export default passport;
