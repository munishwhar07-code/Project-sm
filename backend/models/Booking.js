const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    student: {type: mongoose.Schema.Types.ObjectId,ref: "User",},
    pg:             { type: mongoose.Schema.Types.ObjectId, ref: "PG", required: true },
    studentName:    { type: String, required: true, trim: true },
    studentPhone:   { type: String, required: true, trim: true },
    studentEmail:   { type: String, default: "" },
    collegeName:    { type: String, default: "" },
    course:         { type: String, default: "" },
    year:           { type: String, default: "" },
    roomNumber:     { type: String, default: "" },
    checkInDate:    { type: Date, default: Date.now },
    checkOutDate:   { type: Date },
    priceAtBooking: { type: Number, default: 0 },
    status:         { type: String, enum: ["active", "vacated"], default: "active" },
    vacatedAt:      { type: Date },
    vacateReason:   { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);