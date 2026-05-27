// src/pages/OwnerDashboard.jsx
// ── Owner Dashboard ──────────────────────────────
// Shows after owner logs in
// Owner can: view their listings, add new listing, see booking requests

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export default function OwnerDashboard() {
  const { user, token, logout } = useAuth();
  const [listings,  setListings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [formData,  setFormData]  = useState({ type:"pg", name:"", area:"", city:"", price:"", phone:"", tag:"" });
  const [formError, setFormError] = useState("");
  const [formDone,  setFormDone]  = useState(false);
  const [activeTab, setActiveTab] = useState("listings");

  const STATS = [
    { icon:"🏠", label:"Total Listings",   value: listings.length         },
    { icon:"✔",  label:"Verified",         value: listings.filter(l => l.verified).length },
    { icon:"⚡",  label:"High Freshness",   value: listings.filter(l => l.freshness >= 90).length },
    { icon:"📋",  label:"Pending Requests", value: 0 },
  ];

  // Fetch owner's listings
  useEffect(() => {
    setLoading(true);
    fetch(`${API}/listings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setListings(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); onLogout(); };

  // Add listing
  const handleAddListing = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!formData.name || !formData.area || !formData.city || !formData.price) {
      return setFormError("Name, area, city and price are required");
    }
    try {
      const res  = await fetch(`${API}/listings`, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, price: Number(formData.price) }),
      });
      const data = await res.json();
      if (res.ok) {
        setListings(prev => [data.data, ...prev]);
        setFormDone(true);
        setFormData({ type:"pg", name:"", area:"", city:"", price:"", phone:"", tag:"" });
        setTimeout(() => { setFormDone(false); setShowForm(false); }, 2000);
      } else {
        setFormError(data.error || "Something went wrong");
      }
    } catch { setFormError("Cannot connect to server."); }
  };

  // Delete listing
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this listing?")) return;
    await fetch(`${API}/listings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setListings(prev => prev.filter(l => l._id !== id));
  };

  return (
    <div className="dashboard">

      {/* ── SIDEBAR ── */}
      <aside className="sidebar sidebar-owner">
        <div className="sidebar-logo"><span>Nest</span>mate<em>.</em></div>

        <div className="sidebar-user">
          <div className="user-avatar owner-avatar">{user?.name?.[0]}</div>
          <div>
            <strong>{user?.name}</strong>
            <span className="user-role">🏠 PG Owner</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {[
            { icon:"🏠", label:"My Listings",   id:"listings"  },
            { icon:"📋", label:"Bookings",       id:"bookings"  },
            { icon:"📊", label:"Analytics",      id:"analytics" },
            { icon:"⚙️", label:"Settings",       id:"settings"  },
          ].map(item => (
            <button key={item.id}
              className={`nav-item ${activeTab === item.id ? "nav-active" : ""}`}
              onClick={() => setActiveTab(item.id)}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={logout}>
          🚪 Logout
        </button>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="dash-main">

        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Owner Dashboard</h1>
            <p className="dash-sub">{user?.pgName || "Manage your listings"}</p>
          </div>
          <button className="btn-add-listing" onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Cancel" : "➕ Add Listing"}
          </button>
        </div>

        {/* Stats */}
        <div className="owner-stats">
          {STATS.map(s => (
            <div key={s.label} className="owner-stat">
              <span className="owner-stat-icon">{s.icon}</span>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Add Listing Form */}
        {showForm && (
          <div className="add-listing-form">
            <h3>Add New Listing</h3>
            {formDone  && <div className="form-success">✔ Listing added successfully!</div>}
            {formError && <div className="form-error-msg">⚠ {formError}</div>}
            <form onSubmit={handleAddListing}>
              <div className="owner-form-grid">
                <label>Type
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="pg">PG / Hostel</option>
                    <option value="mess">Mess / Food</option>
                  </select>
                </label>
                <label>Tag
                  <select value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})}>
                    <option value="">Select</option>
                    <option value="Girls Only">Girls Only</option>
                    <option value="Boys Only">Boys Only</option>
                    <option value="Both">Both</option>
                    <option value="Veg">Veg Mess</option>
                    <option value="Non-Veg">Non-Veg</option>
                  </select>
                </label>
                <label>Name *
                  <input type="text" required placeholder="e.g. Sri Lakshmi PG"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </label>
                <label>Area *
                  <input type="text" required placeholder="e.g. Anna Nagar"
                    value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
                </label>
                <label>City *
                  <input type="text" required placeholder="e.g. madurai"
                    value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </label>
                <label>Price (₹/month) *
                  <input type="number" required min="500" placeholder="e.g. 4500"
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </label>
                <label>WhatsApp Number
                  <input type="tel" placeholder="e.g. 9876543210"
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </label>
              </div>
              <button type="submit" className="btn-submit-listing">Add Listing →</button>
            </form>
          </div>
        )}

        {/* Listings Table */}
        <div className="dash-section">
          <h2>Your Listings ({listings.length})</h2>
          {loading ? (
            <p className="loading-text">Loading your listings...</p>
          ) : listings.length === 0 ? (
            <div className="empty-state">
              <p>No listings yet.</p>
              <span>Click "Add Listing" to get started.</span>
            </div>
          ) : (
            <div className="listings-table-wrap">
              <table className="listings-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Type</th><th>Area</th><th>City</th>
                    <th>Price</th><th>Fresh</th><th>Rating</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(l => (
                    <tr key={l._id}>
                      <td><strong>{l.name}</strong></td>
                      <td><span className={`type-chip ${l.type}`}>{l.type}</span></td>
                      <td>{l.area}</td>
                      <td>{l.city}</td>
                      <td>₹{l.price?.toLocaleString()}</td>
                      <td>
                        <span className={`fresh fresh-${l.freshness >= 90 ? "high" : l.freshness >= 70 ? "mid" : "low"}`}>
                          {l.freshness}%
                        </span>
                      </td>
                      <td>★ {l.rating}</td>
                      <td>
                        <button className="tbl-delete" onClick={() => handleDelete(l._id)}>🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}