import { useState, useEffect } from "react";
import "./App.css";

import Navbar          from "./components/Navbar";
import Hero            from "./components/Hero";
import StatsBar        from "./components/StatsBar";
import AddListingForm  from "./components/AddListingForm";
import ListingsSection from "./components/ListingSection";
import HowItWorks      from "./components/HowItWorks";
import Services        from "./components/Services";
import Footer          from "./components/Footer";
import LandingPage     from "./pages/LandingPage";
import OwnerDashboard  from "./pages/OwnerDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MyBookings from "./components/MyBookingModal";
import MyProfile  from "./components/MyProfileModal";


import { pgAPI } from "./api";

// ── Backend base URL ───────────────────────────────────────────
const API = "https://nestmate-backend-u7gx.onrender.com/api"; // 
// ── Fallback seed data (shown when backend is offline) ─────────
const FALLBACK_SEED = [
  { id:1, type:"pg",   name:"Sri Lakshmi PG",     area:"Thiruparankundram", city:"madurai",    price:"₹4,500", tag:"Girls Only",   fresh:98,  rating:"4.7", availableRooms:5,  img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80" },
  { id:2, type:"pg",   name:"Ganesh Men's Hostel", area:"Kodimangalam",      city:"madurai",    price:"₹3,800", tag:"Boys Only",    fresh:85,  rating:"4.4", availableRooms:8,  img:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80" },
  { id:3, type:"pg",   name:"Royal Residency PG",  area:"RS Puram",          city:"coimbatore", price:"₹5,200", tag:"Both",         fresh:100, rating:"4.8", availableRooms:3,  img:"https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80" },
  { id:4, type:"mess", name:"Murugan Mess",         area:"Thiruparankundram", city:"madurai",    price:"₹2,200", tag:"✔ Qty Honest", fresh:95,  rating:"4.6", img:"https://images.unsplash.com/photo-1567521464027-f127ff144326?w=500&q=80" },
  { id:5, type:"mess", name:"Annapoorna Bhavan",    area:"Anna Nagar",        city:"madurai",    price:"₹1,900", tag:"⚠ Qty Drops",  fresh:72,  rating:"4.3", img:"https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=500&q=80" },
  { id:6, type:"mess", name:"Saravana Mess",        area:"RS Puram",          city:"coimbatore", price:"₹2,500", tag:"Non-Veg",      fresh:88,  rating:"4.5", img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80" },
];

// ── Root App ───────────────────────────────────────────────────
export default function App() {
  return (
   
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// ── Router: decides which page to show based on auth ──────────
function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo"><span>Nest</span>mate<em>.</em></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user)                return <LandingPage />;
  if (user.role === "owner") return <OwnerDashboard />;
  return <StudentHome />;
}

// ── Student Home ───────────────────────────────────────────────
function StudentHome() {
  const { user, logout } = useAuth();

  const [activeTab,  setActiveTab]  = useState("stay");
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [listings,   setListings]   = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [searchText, setSearchText] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [apiError,   setApiError]   = useState(false);
  const [showForm,   setShowForm]   = useState(false);
  const [pageReady,  setPageReady]  = useState(false);

  // ── Fetch listings ───────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const type = activeTab === "stay" ? "pg" : "mess";
      const city = cityFilter ? `&city=${cityFilter.toLowerCase()}` : "";
      const url  = `${API}/pgs?type=${type}${city}`;
      console.log("Fetching:", url);
      console.log(activeTab, listings);
      try {
        const res  = await fetch(url);
        const data = await res.json();
        setListings(data.data || []);
        setApiError(false);
      } catch (err) {
        console.warn("Backend unavailable, using seed data:", err.message);
        setApiError(true);
       
        setListings(FALLBACK_SEED.filter(l => l.type === (activeTab === "stay" ? "pg" : "mess")));
      } finally {
        setLoading(false);
        setTimeout(() => setPageReady(true), 300);
      }
    };
    load();
  }, [activeTab, cityFilter]);

  // ── Filter by search text ────────────────────────────────────
 
  const filtered = listings.filter(l =>
    searchText === "" ||
    l.name.toLowerCase().includes(searchText.toLowerCase()) ||
    l.area.toLowerCase().includes(searchText.toLowerCase())
  );

  // ── ADD listing ──────────────────────────────────────────────
  
  const handleAdd = (newListing) => {
    setListings(prev => [newListing, ...prev]);
    setShowForm(false);
  };

  // ── DELETE listing ───────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this listing from Nestmate?")) return;
    try {
      await pgAPI.delete(id);
    } catch (err) {
      console.warn("Delete failed:", err.message);
    }
    setListings(prev => prev.filter(l => (l._id || l.id) !== id));
  };

  // ── Room count update ────────────────────────────────────────
  const handleRoomUpdate = (pgId, newAvailable) => {
    setListings(prev =>
      prev.map(l =>
        (l._id || l.id) === pgId
          ? { ...l, availableRooms: newAvailable }
          : l
      )
    );
  };

  // ── Loading screen ───────────────────────────────────────────
  if (!pageReady) {
    return (
      <div className="loading-screen">
        <div className="loading-logo"><span>Nest</span>mate<em>.</em></div>
        <p>Loading Tamil Nadu's student platform...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {apiError && (
        <div className="api-banner">
          ⚠️ Running in offline mode — backend not connected. Start the backend server to enable bookings &amp; live data.
        </div>
      )}

      <Navbar onListClick={() => setShowForm(!showForm)} />

      
      <Hero query={searchText} setQuery={setSearchText} />

      <StatsBar listings={listings} />

      {showForm && (
        <section className="form-section">
          <div className="container">
            <AddListingForm onAdd={handleAdd} />
          </div>
        </section>
      )}

      <ListingsSection
        listings={filtered}   
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDelete={handleDelete}
        onRoomUpdate={handleRoomUpdate}
      />

      <HowItWorks />
      <Services />
      <Footer onListClick={() => setShowForm(true)} />
    </div>
  );
}