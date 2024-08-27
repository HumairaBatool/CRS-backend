const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/config");

// Middleware Functions
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) { 
    console.log('No token provided');
    return res.status(401).send("Access Denied");
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log('Token error:', err);
      if (err.name === "TokenExpiredError") {
        return res.status(401).send("Token expired");
      }
      return res.status(400).send("Invalid Token");
    }
    req.user = decoded;
    next();
  });
};

// Middleware to verify JWT token
const verifyClientToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: "Failed to authenticate token" });
    }
    console.log(" req.clientId", decoded.id);
    req.clientId = decoded.id;
    next();
  });
};
module.exports = { authenticate, verifyClientToken };
