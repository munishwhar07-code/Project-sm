
const LINKS = [
  { label:"Find PG",      href:"#listings" },
  { label:"Find Mess",    href:"#listings" },
  { label:"Services",     href:"#services" },
  { label:"How It Works", href:"#how"      },
];

export default function Footer({ onListClick }) {
  return (
    <footer className="footer">
      <div className="footer-logo logo">
        <span>Nest</span>mate<em>.</em>
      </div>
      <p>Your home away from home · Tamil Nadu's student living platform · © 2026</p>
      {/* map() renders footer links */}
      <div className="footer-links">
        {LINKS.map(l => (
          <a key={l.label} href={l.href}>{l.label}</a>
        ))}
        <button className="footer-list-btn" onClick={onListClick}>
          List Your PG
        </button>
      </div>
    </footer>
  );
}
