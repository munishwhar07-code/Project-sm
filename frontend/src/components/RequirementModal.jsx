import { useState } from "react";
import { requirementAPI } from "../api";

const EMPTY = {
  studentName:   "",
  studentPhone:  "",
  studentEmail:  "",
  preferredCity: "",
  preferredAreas:"",
  maxBudget:     "",
  minBudget:     "",
  pgType:        "pg",
  gender:        "both",
  needsWifi:     false,
  needsAC:       false,
  needsFood:     false,
  needsLaundry:  false,
  needsParking:  false,
  needsSecurity: false,
  collegeName:   "",
  description:   "",
};

export default function RequirementModal({ onClose }) {
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState(null);  // array of matched PGs

  const validate = (f) => {
    const e = {};
    if (!f.studentName.trim())            e.studentName   = "Name required";
    if (!/^\d{10}$/.test(f.studentPhone)) e.studentPhone  = "Valid 10-digit phone required";
    if (!f.preferredCity.trim())          e.preferredCity = "City required";
    if (!f.maxBudget || f.maxBudget < 500) e.maxBudget   = "Enter a valid budget (min ₹500)";
    return e;
  };

  const set = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const payload = {
        ...form,
        maxBudget:     Number(form.maxBudget),
        minBudget:     Number(form.minBudget || 0),
        preferredAreas: form.preferredAreas
          ? form.preferredAreas.split(",").map(a => a.trim()).filter(Boolean)
          : [],
      };
      const res = await requirementAPI.post(payload);
      setMatches(res.matches || []);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const amenities = [
    { key: "needsWifi",     label: "📶 WiFi" },
    { key: "needsAC",       label: "❄️ AC" },
    { key: "needsFood",     label: "🍽️ Food" },
    { key: "needsLaundry",  label: "🧺 Laundry" },
    { key: "needsParking",  label: "🚗 Parking" },
    { key: "needsSecurity", label: "🔒 Security" },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box--lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">🔍 Post Your Requirement</h2>
            <p className="modal-subtitle">Tell us what you need — we'll find the best matches</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {matches ? (
          <div className="req-matches">
            {matches.length === 0 ? (
              <div className="no-matches">
                <div style={{ fontSize: "3rem" }}>😔</div>
                <h3>No matches found</h3>
                <p>No PGs currently match your criteria. Your requirement has been posted and owners will be notified!</p>
                <button className="btn btn-primary" onClick={onClose} style={{ marginTop: "1rem" }}>Close</button>
              </div>
            ) : (
              <>
                <h3 className="matches-title">🎯 {matches.length} PG{matches.length !== 1 ? "s" : ""} match your requirement!</h3>
                <div className="matches-grid">
                  {matches.map((pg, i) => (
                    <div className="match-card" key={pg._id || i}>
                      <div className="match-rank">#{i + 1}</div>
                      <img src={pg.img} alt={pg.name} className="match-img" />
                      <div className="match-info">
                        <h4>{pg.name}</h4>
                        <p>📍 {pg.area}, {pg.city}</p>
                        <p>
                          <strong>₹{pg.price?.toLocaleString()}/mo</strong>
                          {" · "}
                          <span className="score-chip">Match: {pg.matchScore}pts</span>
                        </p>
                        <div className="match-reasons">
                          {pg.matchReasons?.map((r, j) => (
                            <span key={j} className="match-reason">{r}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-actions" style={{ marginTop: "1.5rem" }}>
                  <button className="btn btn-outline" onClick={onClose}>Close</button>
                  <button className="btn btn-primary" onClick={() => { setMatches(null); setForm(EMPTY); }}>
                    Post Another
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit} noValidate>
            {/* Student Info */}
            <div className="mform-section-label">👤 Your Details</div>
            <div className="mform-row">
              <div className="mform-group">
                <label>Full Name *</label>
                <input
                  className={errors.studentName ? "input-err" : ""}
                  placeholder="Your name"
                  value={form.studentName}
                  onChange={e => set("studentName", e.target.value)}
                />
                {errors.studentName && <span className="err-msg">⚠ {errors.studentName}</span>}
              </div>
              <div className="mform-group">
                <label>Phone Number *</label>
                <input
                  className={errors.studentPhone ? "input-err" : ""}
                  placeholder="10-digit mobile"
                  value={form.studentPhone}
                  onChange={e => set("studentPhone", e.target.value)}
                  maxLength={10}
                />
                {errors.studentPhone && <span className="err-msg">⚠ {errors.studentPhone}</span>}
              </div>
            </div>

            <div className="mform-row">
              <div className="mform-group">
                <label>College Name</label>
                <input
                  placeholder="e.g. Thiagarajar College"
                  value={form.collegeName}
                  onChange={e => set("collegeName", e.target.value)}
                />
              </div>
              <div className="mform-group">
                <label>Email (optional)</label>
                <input
                  type="email"
                  placeholder="student@college.edu"
                  value={form.studentEmail}
                  onChange={e => set("studentEmail", e.target.value)}
                />
              </div>
            </div>

            {/* Location + Budget */}
            <div className="mform-section-label">📍 Location & Budget</div>
            <div className="mform-row">
              <div className="mform-group">
                <label>Preferred City *</label>
                <select
                  className={errors.preferredCity ? "input-err" : ""}
                  value={form.preferredCity}
                  onChange={e => set("preferredCity", e.target.value)}
                >
                  <option value="">Select city</option>
                  {["madurai", "trichy", "coimbatore", "vellore", "chennai", "salem"].map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
                {errors.preferredCity && <span className="err-msg">⚠ {errors.preferredCity}</span>}
              </div>
              <div className="mform-group">
                <label>Preferred Areas (comma separated)</label>
                <input
                  placeholder="e.g. Anna Nagar, RS Puram"
                  value={form.preferredAreas}
                  onChange={e => set("preferredAreas", e.target.value)}
                />
              </div>
            </div>

            <div className="mform-row">
              <div className="mform-group">
                <label>Max Budget (₹/month) *</label>
                <input
                  type="number"
                  className={errors.maxBudget ? "input-err" : ""}
                  placeholder="e.g. 5000"
                  value={form.maxBudget}
                  onChange={e => set("maxBudget", e.target.value)}
                />
                {errors.maxBudget && <span className="err-msg">⚠ {errors.maxBudget}</span>}
              </div>
              <div className="mform-group">
                <label>Min Budget (₹/month)</label>
                <input
                  type="number"
                  placeholder="e.g. 2000"
                  value={form.minBudget}
                  onChange={e => set("minBudget", e.target.value)}
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="mform-section-label">⚙️ Preferences</div>
            <div className="mform-row">
              <div className="mform-group">
                <label>Looking for</label>
                <select value={form.pgType} onChange={e => set("pgType", e.target.value)}>
                  <option value="pg">🏠 PG / Hostel</option>
                  <option value="mess">🍱 Mess / Food</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="mform-group">
                <label>Gender preference</label>
                <select value={form.gender} onChange={e => set("gender", e.target.value)}>
                  <option value="boys">Boys Only</option>
                  <option value="girls">Girls Only</option>
                  <option value="both">Both OK</option>
                </select>
              </div>
            </div>

            {/* Amenities checkboxes */}
            <div className="mform-section-label">🛠️ Must-Have Amenities</div>
            <div className="amenity-grid">
              {amenities.map(({ key, label }) => (
                <label key={key} className={`amenity-chip ${form[key] ? "amenity-on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={e => set(key, e.target.checked)}
                    style={{ display: "none" }}
                  />
                  {label}
                </label>
              ))}
            </div>

            {/* Description */}
            <div className="mform-group mform-full" style={{ marginTop: "1rem" }}>
              <label>Additional Notes</label>
              <textarea
                placeholder="Any specific requirements, preferences or notes for the owner..."
                rows={2}
                value={form.description}
                onChange={e => set("description", e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>

            {errors.submit && <div className="modal-error">❌ {errors.submit}</div>}

            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Finding matches..." : "🔍 Post & Find Matches →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}