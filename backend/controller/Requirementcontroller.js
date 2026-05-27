const Requirement = require("../models/Requirement");
const PG          = require("../models/PG");

// ── POST /api/requirements — Student posts requirement ────────
exports.createRequirement = async (req, res) => {
  try {
    const req_data = req.body;
    const requirement = await Requirement.create(req_data);

    // Auto-match on creation and return suggestions
    const matches = await matchPGs(requirement);

    res.status(201).json({
      success: true,
      message: "Requirement posted! Here are PGs that match your needs.",
      data:    requirement,
      matches,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ── GET /api/requirements/:id/matches — Get matches for a requirement ──
exports.getMatches = async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id);
    if (!requirement) return res.status(404).json({ success: false, error: "Requirement not found" });

    const matches = await matchPGs(requirement);
    res.json({ success: true, count: matches.length, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/requirements — All requirements (admin) ──────────
exports.getAllRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: requirements.length, data: requirements });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── DELETE /api/requirements/:id — Remove requirement ─────────
exports.deleteRequirement = async (req, res) => {
  try {
    await Requirement.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Requirement removed" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Smart PG matching algorithm ───────────────────────────────
async function matchPGs(req) {
  // Build base filter
  const filter = {
    isActive: true,
    city:     req.preferredCity,
    availableRooms: { $gt: 0 },
  };

  // Type filter
  if (req.pgType !== "both") filter.type = req.pgType;

  // Gender / tag filter
  if (req.gender === "boys")  filter.tag = { $in: ["Boys Only", "Both"] };
  if (req.gender === "girls") filter.tag = { $in: ["Girls Only", "Both"] };

  // Budget range
  filter.price = { $gte: req.minBudget || 0, $lte: req.maxBudget };

  const candidates = await PG.find(filter);

  // Score each PG
  const scored = candidates.map((pg) => {
    let score = 0;

    // Area match (10 pts each)
    if (req.preferredAreas && req.preferredAreas.length > 0) {
      const areaMatch = req.preferredAreas.some(a =>
        pg.area.toLowerCase().includes(a.toLowerCase())
      );
      if (areaMatch) score += 10;
    }

    // Amenity matching (5 pts each)
    if (req.needsWifi     && pg.amenities?.wifi)     score += 5;
    if (req.needsAC       && pg.amenities?.ac)       score += 5;
    if (req.needsFood     && pg.amenities?.food)     score += 5;
    if (req.needsLaundry  && pg.amenities?.laundry)  score += 5;
    if (req.needsParking  && pg.amenities?.parking)  score += 5;
    if (req.needsSecurity && pg.amenities?.security) score += 5;

    // Rating bonus
    const rating = parseFloat(pg.rating);
    if (!isNaN(rating)) score += rating * 2;

    // Freshness bonus
    score += (pg.fresh || 0) / 20;

    // Budget proximity bonus (closer to budget = higher score)
    const priceDiff = req.maxBudget - pg.price;
    if (priceDiff >= 0) score += Math.min(priceDiff / 100, 5);

    return { pg, score, matchReasons: buildMatchReasons(pg, req) };
  });

  // Sort by score desc, return top 5
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => ({
      ...s.pg.toJSON(),
      matchScore:   Math.round(s.score),
      matchReasons: s.matchReasons,
    }));
}

function buildMatchReasons(pg, req) {
  const reasons = [];
  if (req.preferredAreas?.some(a => pg.area.toLowerCase().includes(a.toLowerCase()))) {
    reasons.push("📍 In your preferred area");
  }
  if (req.needsWifi     && pg.amenities?.wifi)     reasons.push("📶 WiFi available");
  if (req.needsAC       && pg.amenities?.ac)       reasons.push("❄️ AC available");
  if (req.needsFood     && pg.amenities?.food)     reasons.push("🍽️ Food included");
  if (req.needsLaundry  && pg.amenities?.laundry)  reasons.push("🧺 Laundry facility");
  if (req.needsParking  && pg.amenities?.parking)  reasons.push("🚗 Parking available");
  if (req.needsSecurity && pg.amenities?.security) reasons.push("🔒 Security provided");
  if (pg.availableRooms > 0) reasons.push(`🏠 ${pg.availableRooms} room(s) available`);
  return reasons;
}