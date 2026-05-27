import { useState } from "react";
import Card            from "./Card";
import RequirementModal from "./RequirementModal";

export default function ListingSection({ listings, activeTab, setActiveTab, onDelete, onRoomUpdate }) {
  const [query,         setQuery]         = useState("");
  const [showReqModal,  setShowReqModal]  = useState(false);

  const typeFilter = activeTab === "stay" ? "pg" : "mess";

  const filtered = listings.filter(l =>
    l.type === typeFilter &&
    (query === "" ||
      l.name.toLowerCase().includes(query.toLowerCase()) ||
      l.area.toLowerCase().includes(query.toLowerCase()) ||
      (l.city || "").toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <>
      <section id="listings" className="section listings-section">
        <div className="container">
          <span className="section-tag">Verified Listings</span>
          <h2 className="section-title">Find Your Stay &amp; Eat</h2>

          {/* Tab switcher + Post Requirement button */}
          <div className="tabs-row">
            <div className="tabs">
              <button
                className={activeTab === "stay" ? "tab active" : "tab"}
                onClick={() => setActiveTab("stay")}
              >
                🏠 PG / Hostel
              </button>
              <button
                className={activeTab === "mess" ? "tab active" : "tab"}
                onClick={() => setActiveTab("mess")}
              >
                🍱 Mess / Food
              </button>
            </div>

            {/* Post Requirement — only visible on PG tab */}
            {activeTab === "stay" && (
              <button
                className="btn btn-requirement"
                onClick={() => setShowReqModal(true)}
              >
                🔍 Post Requirement
              </button>
            )}
          </div>

          {/* Inline search */}
          <input
            className="listings-search"
            type="text"
            placeholder="Filter by name, area or city..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />

          <p className="results-count">
            Showing <strong>{filtered.length}</strong> listing{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Cards grid */}
          <div className="cards-grid">
            {filtered.length > 0
              ? filtered.map(item => (
                  <Card
                    key={item._id || item.id}
                    item={item}
                    onDelete={onDelete}
                    onRoomUpdate={onRoomUpdate}
                  />
                ))
              : (
                <p className="no-results">
                  No {activeTab === "stay" ? "PGs" : "messes"} found
                  {query ? ` for "${query}"` : ""}. Try adding one above.
                </p>
              )
            }
          </div>
        </div>
      </section>

      {showReqModal && (
        <RequirementModal onClose={() => setShowReqModal(false)} />
      )}
    </>
  );
}