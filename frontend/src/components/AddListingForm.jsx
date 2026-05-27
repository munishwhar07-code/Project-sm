import { useState, useEffect } from "react";
import { pgAPI } from "../api";

const EMPTY = {
  name: "", area: "", city: "", price: "", type: "pg", tag: "",
  phone: "", availableRooms: "", totalRooms: "", ownerName: "", ownerEmail: "",
  amenities: {
    wifi: false, ac: false, food: false, laundry: false, parking: false, security: false,
  },
};

export default function AddListingForm({ onAdd }) {
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  useEffect(() => {
    if (Object.keys(touched).length > 0) setErrors(validate(form));
  }, [form, touched]);

  const validate = (f) => {
    const e = {};
    if (!f.name.trim())               e.name  = "Name is required";
    if (!f.area.trim())               e.area  = "Area is required";
    if (!f.city.trim())               e.city  = "City is required";
    if (!f.price)                     e.price = "Price is required";
    else if (Number(f.price) < 500)   e.price = "Minimum price is ₹500";
    else if (Number(f.price) > 50000) e.price = "Maximum price is ₹50,000";
    if (f.phone && !/^\d{10}$/.test(f.phone)) e.phone = "Enter valid 10-digit number";
    if (f.type === "pg") {
      if (f.availableRooms === "" || Number(f.availableRooms) < 0)
        e.availableRooms = "Enter available rooms (0 or more)";
    }
    return e;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleAmenity = (key) => {
    setForm(prev => ({
      ...prev,
      amenities: { ...prpev.amenities, [key]: !prev.amenities[key] },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      ["name","area","city","price","phone","availableRooms"].map(k => [k, true])
    );
    setTouched(allTouched);
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await pgAPI.create({
        ...form,
        price:          Number(form.price),
        availableRooms: Number(form.availableRooms || 0),
        totalRooms:     Number(form.totalRooms || form.availableRooms || 0),
        img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80",
      });

      onAdd(res.data);
      setForm(EMPTY);
      setTouched({});
      setErrors({});
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const f = (field, val) => handleChange(field, val);

  const amenityList = [
    { key: "wifi",     label: "📶 WiFi" },
    { key: "ac",       label: "❄️ AC" },
    { key: "food",     label: "🍽️ Food" },
    { key: "laundry",  label: "🧺 Laundry" },
    { key: "parking",  label: "🚗 Parking" },
    { key: "security", label: "🔒 Security" },
  ];

  return (
    <div className="add-form-wrap">
      <h2 className="form-heading">➕ List Your PG / Mess</h2>

      {done && <div className="success-toast">✔ Listing added successfully!</div>}

      <form className="add-form" onSubmit={handleSubmit} noValidate>
        {/* Type + Tag */}
        <div className="form-row">
          <label className="form-group">
            <span>Type *</span>
            <select className="form-input" value={form.type} onChange={e => f("type", e.target.value)}>
              <option value="pg">🏠 PG / Hostel</option>
              <option value="mess">🍱 Mess / Food</option>
            </select>
          </label>
          <label className="form-group">
            <span>Tag</span>
            <select className="form-input" value={form.tag} onChange={e => f("tag", e.target.value)}>
              <option value="">Select tag</option>
              <option value="Girls Only">Girls Only</option>
              <option value="Boys Only">Boys Only</option>
              <option value="Both">Both</option>
              <option value="✔ Qty Honest">Qty Honest (Mess)</option>
              <option value="Non-Veg">Non-Veg (Mess)</option>
            </select>
          </label>
        </div>

        {/* Name + Area */}
        <div className="form-row">
          <label className="form-group">
            <span>Name *</span>
            <input
              className={`form-input ${errors.name && touched.name ? "input-err" : ""}`}
              placeholder="e.g. Sri Lakshmi PG"
              value={form.name}
              onChange={e => f("name", e.target.value)}
            />
            {errors.name && touched.name && <span className="err-msg">⚠ {errors.name}</span>}
          </label>
          <label className="form-group">
            <span>Area *</span>
            <input
              className={`form-input ${errors.area && touched.area ? "input-err" : ""}`}
              placeholder="e.g. Anna Nagar"
              value={form.area}
              onChange={e => f("area", e.target.value)}
            />
            {errors.area && touched.area && <span className="err-msg">⚠ {errors.area}</span>}
          </label>
        </div>

        {/* City + Price */}
        <div className="form-row">
          <label className="form-group">
            <span>City *</span>
            <select
              className={`form-input ${errors.city && touched.city ? "input-err" : ""}`}
              value={form.city}
              onChange={e => f("city", e.target.value)}
            >
              <option value="">Select city</option>
              {["madurai","trichy","coimbatore","vellore","chennai","salem"].map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            {errors.city && touched.city && <span className="err-msg">⚠ {errors.city}</span>}
          </label>
          <label className="form-group">
            <span>Monthly Price (₹) *</span>
            <input
              className={`form-input ${errors.price && touched.price ? "input-err" : ""}`}
              type="number" placeholder="e.g. 4500" min="500"
              value={form.price}
              onChange={e => f("price", e.target.value)}
            />
            {errors.price && touched.price && <span className="err-msg">⚠ {errors.price}</span>}
          </label>
        </div>

        {/* Rooms (only for PG) */}
        {form.type === "pg" && (
          <div className="form-row">
            <label className="form-group">
              <span>Available Rooms *</span>
              <input
                className={`form-input ${errors.availableRooms && touched.availableRooms ? "input-err" : ""}`}
                type="number" placeholder="e.g. 5" min="0"
                value={form.availableRooms}
                onChange={e => f("availableRooms", e.target.value)}
              />
              {errors.availableRooms && touched.availableRooms && (
                <span className="err-msg">⚠ {errors.availableRooms}</span>
              )}
            </label>
            <label className="form-group">
              <span>Total Rooms</span>
              <input
                className="form-input"
                type="number" placeholder="e.g. 20" min="0"
                value={form.totalRooms}
                onChange={e => f("totalRooms", e.target.value)}
              />
            </label>
          </div>
        )}

        {/* Owner info */}
        <div className="form-row">
          <label className="form-group">
            <span>Owner Name</span>
            <input
              className="form-input"
              placeholder="Your name"
              value={form.ownerName}
              onChange={e => f("ownerName", e.target.value)}
            />
          </label>
          <label className="form-group">
            <span>WhatsApp Number (optional)</span>
            <input
              className={`form-input ${errors.phone && touched.phone ? "input-err" : ""}`}
              type="tel" placeholder="e.g. 9876543210"
              value={form.phone}
              onChange={e => f("phone", e.target.value)}
            />
            {errors.phone && touched.phone && <span className="err-msg">⚠ {errors.phone}</span>}
          </label>
        </div>

        {/* Amenities */}
        {form.type === "pg" && (
          <>
            <div className="form-section-label">🛠️ Amenities Available</div>
            <div className="amenity-grid">
              {amenityList.map(({ key, label }) => (
                <label key={key} className={`amenity-chip ${form.amenities[key] ? "amenity-on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={form.amenities[key]}
                    onChange={() => handleAmenity(key)}
                    style={{ display: "none" }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </>
        )}

        {errors.submit && <div className="modal-error" style={{ marginTop: "0.5rem" }}>❌ {errors.submit}</div>}

        <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Add Listing →"}
        </button>
      </form>
    </div>
  );
}