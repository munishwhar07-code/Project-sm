// routes/auth.js
// ── Register · Login · Get Me · Logout ──────────
require("dotenv").config(); 
const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// ── Helper — generate JWT token ──────────────────
const generateToken = (id) => {
  console.log("JWT Secret:", process.env.JWT_SECRET);
  return jwt.sign({ id }, process.env.JWT_SECRET , {
    expiresIn: "7d",
  });
};

// ─────────────────────────────────────────────────
//  POST /api/auth/register
//  Create a new account (student or owner)
//
//  Body:
//  {
//    "name":     "Priya S.",
//    "email":    "priya@tce.edu",
//    "password": "priya1234",
//    "phone":    "9876543210",
//    "role":     "student",        ← "student" or "owner"
//    "college":  "TCE Madurai",    ← students only
//    "city":     "madurai",
//    "pgName":   "Sri Lakshmi PG"  ← owners only
//  }
// ─────────────────────────────────────────────────
router.post("/register", async (req, res) => {
   console.log("Register request:", req.body);
  try {
    const { name, email, password, phone, role, college, city, pgName } = req.body;

    // Validate required fields
    console.log("1");
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "name, email, password and role are required",
      });
    }

    // Check if email already exists
    console.log("2");
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Create user
    console.log("3");
    const user = await User.create({
      name, email, password, phone, role, college, city, pgName,
    });

    // Generate token
    console.log("4");
    const token = generateToken(user._id);

    console.log("5");

    res.status(201).json({
      success: true,
      message: `Welcome to Nestmate, ${user.name}!`,
      token,
      user: {
        id:      user._id,
        name:    user.name,
        email:   user.email,
        role:    user.role,
        college: user.college,
        city:    user.city,
        pgName:  user.pgName,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────
//  POST /api/auth/login
//  Login with email + password
//
//  Body:
//  {
//    "email":    "priya@tce.edu",
//    "password": "priya1234"
//  }
// ─────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user — include password for comparison
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id:      user._id,
        name:    user.name,
        email:   user.email,
        role:    user.role,
        college: user.college,
        city:    user.city,
        pgName:  user.pgName,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────
//  GET /api/auth/me
//  Get currently logged-in user's profile
//  Requires: Authorization: Bearer <token>
// ─────────────────────────────────────────────────
router.get("/me", protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user:    req.user,
  });
});

// ─────────────────────────────────────────────────
//  POST /api/auth/logout
//  Frontend just deletes the token
//  This route confirms logout on server side
// ─────────────────────────────────────────────────
router.post("/logout", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully. Please delete your token.",
  });
});

module.exports = router;