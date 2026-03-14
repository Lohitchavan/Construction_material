// simple JWT auth placeholder
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = { id: payload.id };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
