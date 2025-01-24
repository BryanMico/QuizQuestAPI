const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(400).json({ message: 'Authorization token is missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the user to the request object for further use
    req.user = user;

    // Check if the user has the required role
    if (req.user.role !== 'teacher' && req.originalUrl === '/api/subjects') {
      return res.status(403).json({ message: 'Access denied, teacher role required' });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = authMiddleware;
