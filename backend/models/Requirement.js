const mongoose = require("mongoose");

const requirementSchema = new mongoose.Schema(
  {
    studentName:    { type: String, required: true, trim: true },
    studentPhone:   { type: String, required: true, trim: true },
    studentEmail:   { type: String, default: "" },
    preferredCity:  { type: String, required: true, lowercase: true },
    preferredAreas: { type: [String], default: [] },
    pgType:         { type: String, enum: ["pg", "mess", "both"], default: "pg" },
    gender:         { type: String, enum: ["boys", "girls", "any"], default: "any" },
    minBudget:      { type: Number, default: 0 },
    maxBudget:      { type: Number, required: true },
    needsWifi:      { type: Boolean, default: false },
    needsAC:        { type: Boolean, default: false },
    needsFood:      { type: Boolean, default: false },
    needsLaundry:   { type: Boolean, default: false },
    needsParking:   { type: Boolean, default: false },
    needsSecurity:  { type: Boolean, default: false },
    notes:          { type: String, default: "" },
    isActive:       { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Requirement", requirementSchema);