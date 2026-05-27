import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MyProfileModal  from "./MyProfileModal";
import MyBookingsModal from "./MyBookingModal";

export default function UserProfile() {
  const { user, logout }          = useAuth();
  const navigate                  = useNavigate();
  const [open, setOpen]           = useState(false);
  const [showProfile, setShowProfile]   = useState(false);
  const [showBookings, setShowBookings] = useState(false);

  if (!user) return null;

  return (
    <>
      <div className="nav-user-wrap">
        <button className="nav-user-trigger" onClick={() => setOpen(!open)}>
          <div className="user-avatar nav-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <span>{user.name}</span>
          <span className="nav-chevron">{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <div className="nav-user-dropdown">
            <div className="sidebar-user" style={{ marginBottom: "0.75rem" }}>
              <div className="user-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong style={{ display:"block", fontSize:"0.9rem", color:"var(--navy)" }}>
                  {user.name}
                </strong>
                <span style={{ fontSize:"0.75rem", color:"var(--text-lt)" }}>
                  {user.email}
                </span>
              </div>
            </div>

            <button className="nav-drop-item" onClick={() => { setShowProfile(true);  setOpen(false); }}>
              👤 My Profile
            </button>
            <button className="nav-drop-item" onClick={() => { setShowBookings(true); setOpen(false); }}>
              🏠 My Bookings
            </button>

            <hr style={{ border:"none", borderTop:"1px solid var(--gray-bd)", margin:"0.5rem 0" }} />

            <button className="logout-btn" style={{ width:"100%" }} onClick={() => { logout(); navigate("/"); }}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {showProfile  && <MyProfileModal  onClose={() => setShowProfile(false)}  />}
      {showBookings && <MyBookingsModal onClose={() => setShowBookings(false)} />}
    </>
  );
}