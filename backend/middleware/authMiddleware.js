// middleware/auth.js
// ── JWT Verification Middleware ──────────────────
// Protects routes — only logged-in users can access

const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Token comes in Authorization header as: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please log in.",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request object
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired. Please log in again.",
    });
  }
};

// ── Role-based access ────────────────────────────
// Usage: authorize("owner") — only owners can access
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This route is for ${roles.join(", ")} only.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };