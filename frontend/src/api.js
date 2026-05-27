// ── Central API client ────────────────────────────────────────
// VITE_API_URL is set to "/api" in .env
// Vite proxies /api → http://localhost:5000  (see vite.config.js)
const BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("nestmate_token");

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // ← add this
      ...options.headers, // allow per-call header overrides
    },
  });

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(`Server error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ── PG endpoints ──────────────────────────────────────────────
export const pgAPI = {
  getAll:  (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/pgs${qs ? "?" + qs : ""}`);
  },
  getById: (id)    => request(`/pgs/${id}`),
  create:  (body)  => request("/pgs", { method: "POST", body: JSON.stringify(body) }),
  update:  (id, b) => request(`/pgs/${id}`, { method: "PUT", body: JSON.stringify(b) }),
  delete:  (id)    => request(`/pgs/${id}`, { method: "DELETE" }),
  seed:    ()      => request("/pgs/seed"),
};

// ── Booking endpoints ─────────────────────────────────────────
export const bookingAPI = {
  book:       (body)  => request("/bookings", { method: "POST", body: JSON.stringify(body) }),
  vacate:     (id, b) => request(`/bookings/${id}/vacate`, { method: "PATCH", body: JSON.stringify(b) }),
  getAll:     (p = {}) => {
    const qs = new URLSearchParams(p).toString();
    return request(`/bookings${qs ? "?" + qs : ""}`);
  },
  getByPhone: (phone) => request(`/bookings/student/${phone}`),
  getById:    (id)    => request(`/bookings/${id}`),
};

// ── Requirement endpoints ─────────────────────────────────────
export const requirementAPI = {
  post:       (body) => request("/requirements", { method: "POST", body: JSON.stringify(body) }),
  getMatches: (id)   => request(`/requirements/${id}/matches`),
  getAll:     ()     => request("/requirements"),
  delete:     (id)   => request(`/requirements/${id}`, { method: "DELETE" }),
};