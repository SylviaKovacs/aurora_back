export default function isStaffOrAdmin(req, res, next) {
  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Nincs jogosultság ehhez a művelethez' });
  }
  next();
}
