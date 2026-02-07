
import AuditLog from '../models/AuditLog.js';

export const getAuditLogs = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const logs = await AuditLog.findAll({
      order: [['createdAt', 'DESC']],
      limit
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Audit naplo lekerese sikertelen' });
  }
};
