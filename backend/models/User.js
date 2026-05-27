// models/User.js
// ── MongoDB Schema for Students and Owners ───────

const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Name is required"],
      trim:     true,
    },

    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, "Enter a valid email"],
    },

    password: {
      type:     String,
      required: [true, "Password is required"],
      minlength:[6, "Password must be at least 6 characters"],
    },

    phone: {
      type:  String,
      trim:  true,
    },

    // Role decides which dashboard they see
    role: {
      type:    String,
      enum:    ["student", "owner"],
      default: "student",
    },

    // Student-specific fields
    college: {
      type: String,
      trim: true,
    },

    city: {
      type:      String,
      lowercase: true,
      trim:      true,
    },

    // Owner-specific fields
    pgName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ── Hash password before saving ──────────────────
UserSchema.pre("save", async function (next) {
  // Only hash if password was changed
  if (!this.isModified("password")) return next();
  const salt     = await bcrypt.genSalt(10);
  this.password  = await bcrypt.hash(this.password, salt);

});

// ── Method to compare password on login ──────────
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);