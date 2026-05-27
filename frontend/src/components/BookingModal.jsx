import { useState } from "react";
import { bookingAPI } from "../api";

const EMPTY = {
  studentName:  "",
  studentPhone: "",
  studentEmail: "",
  collegeName:  "",
  course:       "",
  year:         "",
  roomNumber:   "",
  checkInDate:  new Date().toISOString().split("T")[0],
};

export default function BookingModal({ pg, onClose, onBooked }) {
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null); // success or error msg

  const validate = (f) => {
    const e = {};
    if (!f.studentName.trim())            e.studentName  = "Name is required";
    if (!/^\d{10}$/.test(f.studentPhone)) e.studentPhone = "Valid 10-digit phone required";
    if (!f.checkInDate)                   e.checkInDate  = "Check-in date is required";
    return e;
  };

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await bookingAPI.book({ ...form, pgId: pg._id });
      setResult({ type: "success", msg: res.message, booking: res.data });
      setTimeout(() => {
        onBooked({ availableRooms: res.data.pg?.availableRooms });
      }, 2000);
    } catch (err) {
      setResult({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">🏠 Book a Room</h2>
            <p className="modal-subtitle">{pg.name} · {pg.area}</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-availability">
          <span className="avail-chip">
            🟢 {pg.availableRooms} room{pg.availableRooms !== 1 ? "s" : ""} available
          </span>
          <span className="price-chip">
            ₹{typeof pg.price === "number" ? pg.price.toLocaleString() : pg.price}/mo
          </span>
        </div>

        {result ? (
          <div className={`modal-result ${result.type}`}>
            {result.type === "success" ? "✅" : "❌"} {result.msg}
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit} noValidate>
            <div className="mform-row">
              <div className="mform-group">
                <label>Full Name *</label>
                <input
                  className={errors.studentName ? "input-err" : ""}
                  placeholder="e.g. Arjun Kumar"
                  value={form.studentName}
                  onChange={e => handleChange("studentName", e.target.value)}
                />
                {errors.studentName && <span className="err-msg">⚠ {errors.studentName}</span>}
              </div>
              <div className="mform-group">
                <label>Phone Number *</label>
                <input
                  className={errors.studentPhone ? "input-err" : ""}
                  placeholder="10-digit mobile"
                  value={form.studentPhone}
                  onChange={e => handleChange("studentPhone", e.target.value)}
                  maxLength={10}
                />
                {errors.studentPhone && <span className="err-msg">⚠ {errors.studentPhone}</span>}
              </div>
            </div>

            <div className="mform-row">
              <div className="mform-group">
                <label>Email (optional)</label>
                <input
                  type="email"
                  placeholder="student@college.edu"
                  value={form.studentEmail}
                  onChange={e => handleChange("studentEmail", e.target.value)}
                />
              </div>
              <div className="mform-group">
                <label>College Name</label>
                <input
                  placeholder="e.g. Thiagarajar College"
                  value={form.collegeName}
                  onChange={e => handleChange("collegeName", e.target.value)}
                />
              </div>
            </div>

            <div className="mform-row">
              <div className="mform-group">
                <label>Course</label>
                <input
                  placeholder="e.g. B.E. CSE"
                  value={form.course}
                  onChange={e => handleChange("course", e.target.value)}
                />
              </div>
              <div className="mform-group">
                <label>Year</label>
                <select
                  value={form.year}
                  onChange={e => handleChange("year", e.target.value)}
                >
                  <option value="">Select year</option>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                  <option>PG / Masters</option>
                </select>
              </div>
            </div>

            <div className="mform-row">
              <div className="mform-group">
                <label>Room Number (if known)</label>
                <input
                  placeholder="e.g. Room 204"
                  value={form.roomNumber}
                  onChange={e => handleChange("roomNumber", e.target.value)}
                />
              </div>
              <div className="mform-group">
                <label>Check-in Date *</label>
                <input
                  type="date"
                  className={errors.checkInDate ? "input-err" : ""}
                  value={form.checkInDate}
                  onChange={e => handleChange("checkInDate", e.target.value)}
                />
                {errors.checkInDate && <span className="err-msg">⚠ {errors.checkInDate}</span>}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Booking..." : "Confirm Booking →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}