const Booking = require("../models/Booking");
const PG      = require("../models/PG");

// ── POST /api/bookings — Book a room ──────────────────────────
exports.bookRoom = async (req, res) => {
  try {
    const { pgId,student, studentName, studentPhone, studentEmail,
            collegeName, course, year, roomNumber, checkInDate } = req.body;

    // 1. Find the PG
    const pg = await PG.findById(pgId);
    if (!pg) return res.status(404).json({ success: false, error: "PG not found" });

    // 2. Check availability
    if (pg.availableRooms <= 0) {
      return res.status(400).json({
        success: false,
        available: false,
        error: "No rooms available in this PG right now. Please check back later!",
      });
    }

    // 3. Create booking record
    const booking = await Booking.create({
      pg:            pgId,
       student: req.user._id,
      studentName,
      studentPhone,
      studentEmail:  studentEmail  || "",
      collegeName:   collegeName   || "",
      course:        course        || "",
      year:          year          || "",
      roomNumber:    roomNumber    || "",
      checkInDate:   checkInDate   || new Date(),
      priceAtBooking: pg.price,
      status:        "active",
    });

    // 4. Decrement available rooms atomically
    await PG.findByIdAndUpdate(pgId, { $inc: { availableRooms: -1 } });

    // 5. Return with populated PG info
    const populated = await booking.populate("pg", "name area city price availableRooms");

    res.status(201).json({
      success:  true,
      available: true,
      message:  `Room successfully booked at ${pg.name}! Welcome, ${studentName} 🎉`,
      data:     populated,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ── PATCH /api/bookings/:id/vacate — Student vacates room ─────
exports.vacateRoom = async (req, res) => {
  try {
    const { vacateReason } = req.body;

    // 1. Find active booking
    const booking = await Booking.findById(req.params.id).populate("pg");
    if (!booking) return res.status(404).json({ success: false, error: "Booking not found" });
    if (booking.status === "vacated") {
      return res.status(400).json({ success: false, error: "Room already vacated" });
    }

    // 2. Mark as vacated
    booking.status      = "vacated";
    booking.vacatedAt   = new Date();
    booking.vacateReason = vacateReason || "";
    booking.checkOutDate = new Date();
    await booking.save();

    // 3. Increment available rooms atomically
    await PG.findByIdAndUpdate(booking.pg._id, { $inc: { availableRooms: 1 } });

    res.json({
      success: true,
      message: `Room vacated successfully. Available rooms updated for ${booking.pg.name}.`,
      data:    booking,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/bookings — All bookings (admin view) ─────────────
exports.getAllBookings = async (req, res) => {
  try {
    const { pgId, status } = req.query;
    const filter = {};
    if (pgId)   filter.pg     = pgId;
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("pg", "name area city")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/bookings/student/:phone — Bookings by phone ──────
exports.getStudentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ studentPhone: req.params.phone })
      .populate("pg", "name area city price img availableRooms")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/bookings/:id — Single booking ────────────────────
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("pg", "name area city price img phone ownerName");
    if (!booking) return res.status(404).json({ success: false, error: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.getMyBookings = async (req, res) => {
  try {
    console.log(req.user);

    const bookings = await Booking.find({
      student: req.user._id,
    }).populate("pg");

    res.status(200).json(bookings);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};