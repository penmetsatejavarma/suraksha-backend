const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // Get token from request header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided. Please login.' });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    // Move to next function
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
  }
};

module.exports = protect;