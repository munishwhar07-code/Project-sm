import UserProfile from "./UserProfile";
export default function Navbar({ onListClick }) {
  return (
    <header className="navbar">
      <a href="#home" className="logo">
        <span>Nest</span>mate<em>.</em>
      </a>
      <nav className="nav-links">
        <a href="#listings">Listings</a>
        <a href="#how">How It Works</a>
        <a href="#services">Services</a>
      </nav>
      {/* Button triggers Add Listing modal in App */}
      <button className="btn btn-primary" onClick={onListClick}>
        List Your PG
      </button>
      <UserProfile />
    </header>
  );
}
