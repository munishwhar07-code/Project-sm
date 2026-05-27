
const STEPS = [
  { icon:"🔍", title:"Search",  desc:"Enter your college or area across Tamil Nadu." },
  { icon:"📋", title:"Compare", desc:"Check freshness scores and honest student reviews." },
  { icon:"🏠", title:"Settle",  desc:"Contact owners directly. No broker. Move in fast." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="section how-section">
      <div className="container">
        <span className="section-tag">Simple Process</span>
        <h2 className="section-title">Settle in 3 steps</h2>
        {/* map() renders each step card */}
        <div className="steps">
          {STEPS.map((s, i) => (
            <div key={i} className="step">
              <div className="step-icon">{s.icon}</div>
              <strong>{s.title}</strong>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
