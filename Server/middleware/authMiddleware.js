const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

// Extend Request interface to include user
const isAuthenticated = async (req, res, next) => {
  try {

    let token;

    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader) {
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim(); 
      } else {
        token = authHeader.trim();
      }
    }

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (verifyError) {
      if (verifyError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token has expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    if (!decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }
    const currentUser = await User.findById(decoded.userId).select('-password'); // Exclude password
    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Attach user to request object
    req.user = currentUser;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Not authorized, token has expired" });
    }

    return res.status(500).json({ message: "Server error during authentication" });
  }
};

module.exports = isAuthenticated