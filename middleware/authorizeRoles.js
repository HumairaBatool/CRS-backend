// middleware/authorizeRoles.js
// const db = require('../models');
const authorizeRoles = (roles) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        console.log('User not found');
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!roles.includes(user.role)) {
        console.log('User role not authorized:', user.role);
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
