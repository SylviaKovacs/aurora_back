
export default function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ismeretlen hiba történt';

  res.status(statusCode).json({
    error: message,
    path: req.originalUrl,
    method: req.method
  });
}
