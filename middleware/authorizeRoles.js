// middleware/authorizeRoles.js
const db = require('../models');

const authorizeRoles = (roles) => {
  return async (req, res, next) => {
    try {
      // Ensure user information is attached to req.user by authenticate middleware
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      // Fetch user role from database
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (error) {
      console.error('Error in authorization middleware:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = authorizeRoles;
