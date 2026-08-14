const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Read token from cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Please login."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};

const permit = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to access this resource."
      });
    }

    next();
  };
};

module.exports = {
  auth,
  permit
};