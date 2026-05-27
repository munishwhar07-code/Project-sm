const PG = require("../models/PG");

// ── GET all PGs ───────────────────────────────────────────────
exports.getAllPGs = async (req, res) => {
  try {
    const { city, type, tag } = req.query;
    const filter = { isActive: true };
    if (city)  filter.city  = city.toLowerCase();
    if (type)  filter.type  = type;
    if (tag)   filter.tag   = tag;

    const pgs = await PG.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: pgs.length, data: pgs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET single PG ─────────────────────────────────────────────
exports.getPGById = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ success: false, error: "PG not found" });
    res.json({ success: true, data: pg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── POST create PG listing ────────────────────────────────────
exports.createPG = async (req, res) => {
  try {
    const {
      name, area, city, price, type, tag, phone, img,
      totalRooms, availableRooms, amenities, ownerName, ownerEmail,
    } = req.body;

    const rooms = parseInt(availableRooms || totalRooms || 0);

    const pg = await PG.create({
      name, area, city, price: Number(price), type, tag, phone, img,
      totalRooms: parseInt(totalRooms || rooms),
      availableRooms: rooms,
      amenities: amenities || {},
      ownerName: ownerName || "",
      ownerEmail: ownerEmail || "",
    });

    res.status(201).json({ success: true, data: pg });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ── PUT update PG ─────────────────────────────────────────────
exports.updatePG = async (req, res) => {
  try {
    const pg = await PG.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pg) return res.status(404).json({ success: false, error: "PG not found" });
    res.json({ success: true, data: pg });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ── DELETE PG ─────────────────────────────────────────────────
exports.deletePG = async (req, res) => {
  try {
    const pg = await PG.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!pg) return res.status(404).json({ success: false, error: "PG not found" });
    res.json({ success: true, message: "PG listing removed" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

