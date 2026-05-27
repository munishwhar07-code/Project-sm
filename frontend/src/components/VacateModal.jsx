import { useState } from "react";
import { bookingAPI } from "../api";

export default function VacateModal({ pg, onClose, onVacated }) {
  const [step,    setStep]    = useState("lookup"); // lookup | confirm | done
  const [phone,   setPhone]   = useState("");
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reason,  setReason]  = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [message, setMessage] = useState("");

  // Step 1: Look up active bookings by phone number
  const handleLookup = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await bookingAPI.getByPhone(phone);
      // Filter active bookings for THIS pg
      const active = res.data.filter(
        b => b.status === "active" && (b.pg?._id === pg._id || b.pg === pg._id)
      );
      if (active.length === 0) {
        setError("No active booking found for this phone number at this PG.");
      } else {
        setBookings(active);
        setSelected(active[0]);
        setStep("confirm");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm vacate
  const handleVacate = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");
    try {
      const res = await bookingAPI.vacate(selected._id, { vacateReason: reason });
      setMessage(res.message);
      setStep("done");
      setTimeout(() => onVacated({ availableRooms: undefined }), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box--sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">🔑 Vacate Room</h2>
            <p className="modal-subtitle">{pg.name} · {pg.area}</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {step === "lookup" && (
          <form className="modal-form" onSubmit={handleLookup} noValidate>
            <p className="modal-info">
              Enter your registered phone number to find your booking.
            </p>
            <div className="mform-group mform-full">
              <label>Registered Phone Number</label>
              <input
                placeholder="10-digit mobile number"
                value={phone}
                onChange={e => { setPhone(e.target.value); setError(""); }}
                maxLength={10}
              />
            </div>
            {error && <div className="modal-error">❌ {error}</div>}
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Looking up..." : "Find My Booking →"}
              </button>
            </div>
          </form>
        )}

        {step === "confirm" && selected && (
          <div className="modal-form">
            <div className="vacate-booking-card">
              <div className="vbc-row">
                <span className="vbc-label">Student</span>
                <span className="vbc-val">{selected.studentName}</span>
              </div>
              <div className="vbc-row">
                <span className="vbc-label">Check-in</span>
                <span className="vbc-val">
                  {new Date(selected.checkInDate).toLocaleDateString("en-IN")}
                </span>
              </div>
              {selected.roomNumber && (
                <div className="vbc-row">
                  <span className="vbc-label">Room</span>
                  <span className="vbc-val">{selected.roomNumber}</span>
                </div>
              )}
              <div className="vbc-row">
                <span className="vbc-label">Monthly Rent</span>
                <span className="vbc-val">₹{selected.priceAtBooking?.toLocaleString()}</span>
              </div>
            </div>

            <div className="mform-group mform-full">
              <label>Reason for vacating (optional)</label>
              <textarea
                placeholder="e.g. Course completed, shifted to hostel..."
                rows={2}
                value={reason}
                onChange={e => setReason(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="vacate-warning">
              ⚠️ This action will mark your room as vacated and increase available rooms by 1.
            </div>

            {error && <div className="modal-error">❌ {error}</div>}

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setStep("lookup")}>← Back</button>
              <button
                className="btn btn-vacate-confirm"
                disabled={loading}
                onClick={handleVacate}
              >
                {loading ? "Processing..." : "✓ Confirm Vacate"}
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="modal-result success" style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎉</div>
            <p>{message || "Room vacated successfully!"}</p>
            <p style={{ marginTop: "0.5rem", opacity: 0.7, fontSize: "0.85rem" }}>
              Available rooms have been updated for the owner.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}