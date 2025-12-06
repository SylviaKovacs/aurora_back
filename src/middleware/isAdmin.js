export default function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Nincs jogosultság ehhez a művelethez' });
  }
  next();
}
