const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_ecom_key';

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header, access denied' });
  }

  // Token format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token format is invalid, must be Bearer <token>' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user; // Attach user info (id) to request object
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};
