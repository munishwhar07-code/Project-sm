const mongoose = require("mongoose");

const pgSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, trim: true },
    area:           { type: String, required: true, trim: true },
    city:           { type: String, required: true, lowercase: true, trim: true },
    price:          { type: Number, required: true, min: 0 },
    type:           { type: String, enum: ["pg", "mess"], default: "pg" },
    tag:            { type: String, default: "" },
    phone:          { type: String, default: "" },
    img:            { type: String, default: "" },
    fresh:          { type: Number, default: 80, min: 0, max: 100 },
    rating:         { type: String, default: "4.0" },
    totalRooms:     { type: Number, default: 0, min: 0 },
    availableRooms: { type: Number, default: 0, min: 0 },
    amenities: {
      wifi:     { type: Boolean, default: false },
      ac:       { type: Boolean, default: false },
      food:     { type: Boolean, default: false },
      laundry:  { type: Boolean, default: false },
      parking:  { type: Boolean, default: false },
      security: { type: Boolean, default: false },
    },
    ownerName:  { type: String, default: "" },
    ownerEmail: { type: String, default: "" },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PG", pgSchema);