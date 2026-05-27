
export default function Hero({ query, setQuery }) {
  return (
    <section id="home" className="hero">
      <div className="hero-overlay" />
      <img
        src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80"
        alt="Students"
        className="hero-bg"
      />
      <div className="hero-content">
        <span className="hero-tag">🎓 Tamil Nadu Student Living Platform</span>
        <h1>
          Your <em>Nest</em> Away<br />From Home
        </h1>
        <p>
          Verified PGs, honest mess ratings, and local services —
          built for students in Tamil Nadu college towns.
        </p>
        {/* Search input — controlled by App state */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search college or area (e.g. TCE Madurai…)"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById("listings")
              .scrollIntoView({ behavior: "smooth" })}
          >
            Search
          </button>
        </div>
        {/* Quick city filter tags */}
        <div className="hero-city-tags">
          {["Madurai", "Trichy", "Coimbatore", "Vellore"].map(city => (
            <button
              key={city}
              className="city-pill"
              onClick={() => {
                setQuery(city);
                document.getElementById("listings")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
