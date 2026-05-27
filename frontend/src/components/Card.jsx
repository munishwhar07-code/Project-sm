import { useState } from "react";
import BookingModal  from "./BookingModal";
import VacateModal   from "./VacateModal";
import { useAuth } from "../context/AuthContext";

export default function Card({ item, onDelete, onRoomUpdate }) {
  const [saved,          setSaved]          = useState(false);
  const [showBook,       setShowBook]       = useState(false);
  const [showVacate,     setShowVacate]     = useState(false);
  const [localAvailable, setLocalAvailable] = useState(
    item.availableRooms ?? null
  );
   const { user } = useAuth();
  const token = localStorage.getItem("token"); 

  const freshCls = item.fresh >= 90 ? "high" : item.fresh >= 70 ? "mid" : "low";
  const isBookable = item.type === "pg" && item._id; // backend PGs have _id

  const available = localAvailable ?? item.availableRooms ?? null;
  const isFullyBooked = isBookable && available === 0;

  const handleContact = () => {
    if (item.phone) {
      const msg = encodeURIComponent(
        `Hi, I found your listing "${item.name}" on Nestmate. Is it available?`
      );
      window.open(`https://wa.me/91${item.phone}?text=${msg}`, "_blank");
    } else {
      alert("Owner contact not available yet.");
    }
  };

  const handleBooked = (updatedPG) => {
    setLocalAvailable(updatedPG.availableRooms ?? available - 1);
    onRoomUpdate?.(item._id || item.id, updatedPG.availableRooms ?? available - 1);
    setShowBook(false);
  };

  const handleVacated = (updatedPG) => {
    setLocalAvailable(updatedPG.availableRooms ?? available + 1);
    onRoomUpdate?.(item._id || item.id, updatedPG.availableRooms ?? available + 1);
    setShowVacate(false);
  };

  return (
    <>
      <article className="card">
        <div className="card-img-wrap">
          <img src={item.img || item.imgUrl} alt={item.name} className="card-img" />
          <span className="card-tag">{item.tag}</span>
          <button
            className={`save-btn ${saved ? "saved" : ""}`}
            onClick={() => setSaved(!saved)}
            aria-label="Save"
          >
            {saved ? "♥" : "♡"}
          </button>

          {/* Room availability badge — only for PG type */}
          {isBookable && (
            <span className={`room-badge ${isFullyBooked ? "room-full" : "room-avail"}`}>
              {isFullyBooked
                ? "🔴 Full"
                : `🟢 ${available} room${available !== 1 ? "s" : ""} free`}
            </span>
          )}
        </div>

        <div className="card-body">
          <h3 className="card-name">{item.name}</h3>
          <p className="card-area">📍 {item.area}</p>

          <div className="card-row">
            <span className={`fresh fresh-${freshCls}`}>⚡ {item.fresh}% Fresh</span>
            <span className="rating">★ {item.rating}</span>
          </div>

          <div className="card-footer">
            <strong className="price">
              {typeof item.price === "number"
                ? `₹${item.price.toLocaleString()}`
                : item.price}
              <span>/mo</span>
            </strong>

            <div className="card-actions">
              <button className="btn btn-sm" onClick={handleContact}>
                Contact
              </button>

              {/* Book Room button */}
              {isBookable && !isFullyBooked && (
                <button
                  className="btn btn-sm btn-book"
                  onClick={() => setShowBook(true)}
                >
                  🏠 Book Room
                </button>
              )}

              {/* Vacate Room button */}
              {isBookable && (
                <button
                  className="btn btn-sm btn-vacate"
                  onClick={() => setShowVacate(true)}
                  title="Vacate your room"
                >
                  🔑 Vacate
                </button>
              )}

              {onDelete && (
                <button
                  className="btn btn-sm btn-delete"
                  onClick={() => onDelete(item._id || item.id)}
                >
                  🗑
                </button>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Booking modal */}
      {showBook && (
        <BookingModal
          pg={item}
          onClose={() => setShowBook(false)}
          onBooked={handleBooked}
        />
      )}

      {/* Vacate modal */}
      {showVacate && (
        <VacateModal
          pg={item}
          onClose={() => setShowVacate(false)}
          onVacated={handleVacated}
        />
      )}
    </>
  );
}