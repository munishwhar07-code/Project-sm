
import { useState } from "react";

const SERVICES = [
  { icon:"🧺", label:"Laundry",    desc:"Pickup & delivery" },
  { icon:"📋", label:"Xerox",      desc:"Near your college" },
  { icon:"🛵", label:"Auto",       desc:"Trusted drivers"   },
  { icon:"📚", label:"Books",      desc:"All stationery"    },
  { icon:"💇", label:"Salon",      desc:"Affordable cuts"   },
  { icon:"🏋️", label:"Gym",        desc:"Student rates"     },
];

export default function Services() {
  const [clicked, setClicked] = useState(null);

  return (
    <section id="services" className="section services-section">
      <div className="container">
        <span className="section-tag">Settle Tab</span>
        <h2 className="section-title">Everything a fresher needs</h2>
        <p className="section-sub">Trusted local services curated by seniors.</p>
        {/* map() renders each service chip */}
        <div className="services-grid">
          {SERVICES.map(s => (
            <div
              key={s.label}
              className={`service-chip ${clicked === s.label ? "chip-active" : ""}`}
              onClick={() => {
                setClicked(s.label);
                alert(`${s.label} listings coming soon in your area!`);
              }}
            >
              <span className="chip-icon">{s.icon}</span>
              <span className="chip-label">{s.label}</span>
              <span className="chip-desc">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
