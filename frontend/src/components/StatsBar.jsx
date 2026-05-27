
export default function StatsBar({ listings }) {
  // Compute live stats from listings prop
  const stats = [
    { value: listings.length,                              label: "Total Listings"   },
    { value: listings.filter(l => l.type === "pg").length, label: "PGs Available"   },
    { value: listings.filter(l => l.type === "mess").length,label: "Messes Listed"  },
    { value: listings.filter(l => l.fresh >= 90).length,   label: "Freshness ≥ 90%" },
  ];

  return (
    <section className="stats">
      {/* map() used to render each stat dynamically */}
      {stats.map(s => (
        <div key={s.label} className="stat">
          <strong>{s.value}</strong>
          <span>{s.label}</span>
        </div>
      ))}
    </section>
  );
}
