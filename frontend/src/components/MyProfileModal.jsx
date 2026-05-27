import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MyBookingsModal from "./MyBookingModal";

export default function MyProfileModal({ onClose }) {
  const { user, logout }      = useAuth();
  const navigate              = useNavigate();
  const [showBookings, setShowBookings] = useState(false);

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <>
       <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="modal-title">My Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="profile-card">

          {/* Avatar */}
          <div className="profile-avatar-lg">
            {initials}
          </div>

          {/* Details */}
          <div className="profile-details">
            <h2 className="profile-name-lg">{user.name}</h2>

            <div className="profile-fields">
              <div className="profile-field">
                <span className="field-label">📧 Email</span>
                <span className="field-value">{user.email}</span>
              </div>

              {user.phone && (
                <div className="profile-field">
                  <span className="field-label">📞 Phone</span>
                  <span className="field-value">{user.phone}</span>
                </div>
              )}

              {user.role && (
                <div className="profile-field">
                  <span className="field-label">👤 Role</span>
                  <span className="field-value" style={{ textTransform: "capitalize" }}>
                    {user.role}
                  </span>
                </div>
              )}

              <div className="profile-field">
                <span className="field-label">🗓 Member Since</span>
                <span className="field-value">
                  {new Date(user.createdAt).toLocaleDateString("en-IN", {
                    month: "long", year: "numeric"
                  })}
                </span>
              </div>
            </div>

            <div className="profile-actions">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/my-bookings")}
              >
                🏠 View My Bookings
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
      {/* Bookings popup on top */}
      {showBookings && (
        <MyBookingsModal onClose={() => setShowBookings(false)} />
      )}
    </>
  );
}