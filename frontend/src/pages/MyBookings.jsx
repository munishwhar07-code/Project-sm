import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MyBookings() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!user) { navigate("/"); return; }

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("nestmate_token");
        const res   = await fetch("http://localhost:5000/api/bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <div className="page-wrap">
      <div className="container">

        {/* Header */}
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="page-title">My Bookings</h1>
          <p className="page-sub">All your booked PGs in one place</p>
        </div>

        {/* Content */}
        {loading ? (
          <p className="loading-text">Loading your bookings...</p>

        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: "3rem" }}>🏠</span>
            <p>No bookings yet</p>
            <span>Browse PGs and book your perfect stay</span>
            <button
              className="btn btn-primary"
              style={{ marginTop: "1rem" }}
              onClick={() => navigate("/")}
            >
              Explore PGs
            </button>
          </div>

        ) : (
          <div className="bookings-list">
            {bookings.map((b) => (
              <div className="booking-card" key={b._id}>
                <img
                  src={b.pg?.imgUrl || b.pg?.img}
                  alt={b.pg?.name}
                  className="booking-img"
                />
                <div className="booking-info">
                  <h3>{b.pg?.name}</h3>
                  <p className="card-area">📍 {b.pg?.area}</p>
                  <p className="booking-date">
                    📅 Booked on {new Date(b.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </p>
                  <span className={`booking-status status-${b.status}`}>
                    {b.status === "active" ? "✅ Active" : "❌ Vacated"}
                  </span>
                </div>
                <div className="booking-price">
                  <strong>₹{b.pg?.price?.toLocaleString()}</strong>
                  <span>/mo</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}