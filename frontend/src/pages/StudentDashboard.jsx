// src/pages/StudentDashboard.jsx
// ── Student Dashboard ────────────────────────────
// Shows after student logs in

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

const QUICK_LINKS = [
  { icon:"🏠", label:"Find PG",     desc:"Browse verified PGs near your college" },
  { icon:"🍱", label:"Find Mess",   desc:"Honest mess ratings and today's menu"  },
  { icon:"📋", label:"My Bookings", desc:"Track your booking requests"           },
  { icon:"🛵", label:"Services",    desc:"Laundry, auto, xerox and more"         },
];

export default function StudentDashboard({ onLogout }) {
  const { user, token, logout } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("pg");

  // Fetch listings on mount
  useEffect(() => {
    fetch(`${API}/listings?type=${tab}&city=${user?.city || ""}`)
      .then(r => r.json())
      .then(d => { setListings(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [tab]);

  const handleLogout = () => { logout(); onLogout(); };

  return (
    <div className="dashboard">

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-logo"><span>Nest</span>mate<em>.</em></div>

        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.[0]}</div>
          <div>
            <strong>{user?.name}</strong>
            <span className="user-role">🎓 Student</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {[
            { icon:"🏠", label:"Find PG"      },
            { icon:"🍱", label:"Find Mess"    },
            { icon:"📋", label:"My Bookings"  },
            { icon:"🛵", label:"Services"     },
            { icon:"⚙️", label:"Settings"     },
          ].map(item => (
            <button key={item.label} className="nav-item">
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="dash-main">

        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Welcome, {user?.name?.split(" ")[0]} 👋</h1>
            <p className="dash-sub">
              {user?.college && `${user.college} · `}
              {user?.city && `${user.city.charAt(0).toUpperCase() + user.city.slice(1)}`}
            </p>
          </div>
          <div className="dash-header-right">
            <span className="online-dot" />
            <span style={{ fontSize:"0.82rem", color:"#7A93B0" }}>Online</span>
          </div>
        </div>

        {/* Quick links */}
        <div className="quick-links">
          {QUICK_LINKS.map(q => (
            <div key={q.label} className="quick-card">
              <span className="quick-icon">{q.icon}</span>
              <strong>{q.label}</strong>
              <p>{q.desc}</p>
            </div>
          ))}
        </div>

        {/* Listings */}
        <div className="dash-section">
          <div className="dash-section-header">
            <h2>Listings near you</h2>
            <div className="mini-tabs">
              <button className={tab === "pg"   ? "mini-tab active" : "mini-tab"} onClick={() => setTab("pg")}>🏠 PG</button>
              <button className={tab === "mess" ? "mini-tab active" : "mini-tab"} onClick={() => setTab("mess")}>🍱 Mess</button>
            </div>
          </div>

          {loading ? (
            <p className="loading-text">Loading listings...</p>
          ) : listings.length === 0 ? (
            <div className="empty-state">
              <p>No listings found in your city yet.</p>
              <span>More listings are being added every day!</span>
            </div>
          ) : (
            <div className="dash-cards">
              {listings.slice(0, 6).map(l => (
                <div key={l._id} className="dash-card">
                  <img src={l.imgUrl} alt={l.name} className="dash-card-img" />
                  <div className="dash-card-body">
                    <h4>{l.name}</h4>
                    <p>📍 {l.area}</p>
                    <div className="dash-card-row">
                      <span className={`fresh fresh-${l.freshness >= 90 ? "high" : l.freshness >= 70 ? "mid" : "low"}`}>
                        ⚡ {l.freshness}%
                      </span>
                      <span className="rating">★ {l.rating}</span>
                    </div>
                    <div className="dash-card-footer">
                      <strong>₹{l.price?.toLocaleString()}/mo</strong>
                      <button className="btn-contact"
                        onClick={() => window.open(`https://wa.me/91${l.phone}?text=${encodeURIComponent(`Hi, I found "${l.name}" on Nestmate. Is it available?`)}`, "_blank")}>
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}