
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API = "https://nestmate-backend-u7gx.onrender.com/api";

export function AuthProvider({ children }) {
  const [token,   setToken]   = useState(localStorage.getItem("nestmate_token"));
  const [loading, setLoading] = useState(true); 
  const [user, setUser] = useState(() => {
      const stored = localStorage.getItem("nestmate_user");
      return stored ? JSON.parse(stored) : null;
    });
  // ── On mount — restore user from saved token ──
  useEffect(() => {
    const restoreUser = async () => {
      const savedToken = localStorage.getItem("nestmate_token");
      if (!savedToken) { setLoading(false); return; }
      try {
        const res  = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        const data = await res.json();
        if (res.ok) { setUser(data.user); setToken(savedToken);}
        else        { localStorage.removeItem("nestmate_token"); }
      } catch { localStorage.removeItem("nestmate_token"); }
      finally  { setLoading(false); }
    };
    restoreUser();
  }, []);

  // ── Register ──────────────────────────────────
  const register = async (formData) => {
    const res  = await fetch(`${API}/auth/register`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Registration successful! Please log in.");
      return{success: true};
    }
    return data; // return so page can show errors
  };

  // ── Login ─────────────────────────────────────
  const login = async (email, password) => {
    const res  = await fetch(`${API}/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Logged in successfully!");
      localStorage.setItem("nestmate_token", data.token);
      localStorage.setItem("nestmate_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  // ── Logout ────────────────────────────────────
 const logout = () => {
  localStorage.removeItem("nestmate_token");
  localStorage.removeItem("nestmate_user"); // ← add this
  setToken(null);
  setUser(null);
};

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use anywhere in app
export const useAuth = () => useContext(AuthContext);