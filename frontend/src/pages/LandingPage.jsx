// src/pages/LandingPage.jsx
// ── Initial Page — Login or Sign Up ─────────────
// Shows two tabs: Login | Sign Up
// After success → redirects based on role

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const [tab,     setTab]     = useState("login"); // "login" | "register"
  const [role,    setRole]    = useState("student");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({ email:"", password:"" });

  // Register form state
  const [regForm, setRegForm] = useState({
    name:"", email:"", password:"", confirmPassword:"",
    phone:"", role:"student", college:"", city:"", pgName:"",
  });

  const { login, register } = useAuth();

  // ── LOGIN SUBMIT ──────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const data = await login(loginForm.email, loginForm.password);
    setLoading(false);
    if (!data.success) setError(data.message);
  };

  // ── REGISTER SUBMIT ───────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (regForm.password !== regForm.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (regForm.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    setLoading(true);
    const data = await register(regForm);
    setLoading(false);
    if (!data.success) setError(data.message);
  };

  return (
    <div className="landing">

      {/* ── LEFT PANEL ── */}
      <div className="landing-left">
        <div className="landing-brand">
          <div className="brand-logo"><span>Nest</span>mate<em>.</em></div>
          <p className="brand-tagline">Your home away from home</p>
        </div>
        <div className="brand-features">
          {[
            { icon:"⚡", text:"Freshness score on every listing" },
            { icon:"✔", text:"Pakka verified PGs and messes"    },
            { icon:"🍱", text:"Honest mess quantity ratings"     },
            { icon:"🏙️", text:"Tamil Nadu college towns covered" },
          ].map(f => (
            <div key={f.text} className="brand-feature">
              <span>{f.icon}</span><p>{f.text}</p>
            </div>
          ))}
        </div>
        <img
          src="https://as2.ftcdn.net/jpg/00/93/90/15/1000_F_93901583_pmJhlrt1OQ0LKDQvuS1sz5Cv5gjbxHoc.jpg"
          alt="Students"
          className="landing-img"
        />
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="landing-right">
        <div className="auth-card">

          {/* Tabs */}
          <div className="auth-tabs">
            <button className={`auth-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => { setTab("login"); setError(""); }}>
              Login
            </button>
            <button className={`auth-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => { setTab("register"); setError(""); }}>
              Sign Up
            </button>
          </div>

          {error && <div className="auth-error">⚠ {error}</div>}

          {/* ── LOGIN FORM ── */}
          {tab === "login" && (
            <form className="auth-form" onSubmit={handleLogin}>
              <h2 className="auth-title">Welcome back 👋</h2>
              <p className="auth-sub">Login to your Nestmate account</p>

              <label className="auth-label">Email
                <input className="auth-input" type="email" required placeholder="your@email.com"
                  value={loginForm.email}
                  onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
              </label>

              <label className="auth-label">Password
                <input className="auth-input" type="password" required placeholder="Enter password"
                  value={loginForm.password}
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
              </label>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Logging in..." : "Login →"}
              </button>

              <p className="auth-switch">
                Don't have an account?{" "}
                <button type="button" className="link-btn" onClick={() => setTab("register")}>
                  Sign up free
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === "register" && (
            <form className="auth-form" onSubmit={handleRegister}>
              <h2 className="auth-title">Create account ✨</h2>
              <p className="auth-sub">Join thousands of students on Nestmate</p>

              {/* Role selector */}
              <div className="role-select">
                {["student","owner"].map(r => (
                  <button key={r} type="button"
                    className={`role-btn ${regForm.role === r ? "active" : ""}`}
                    onClick={() => setRegForm({...regForm, role: r})}>
                    {r === "student" ? "🎓 I am a Student" : "🏠 I am a PG Owner"}
                  </button>
                ))}
              </div>

              {/* Common fields */}
              <div className="form-row-2">
                <label className="auth-label">Full Name *
                  <input className="auth-input" type="text" required placeholder="Your full name"
                    value={regForm.name}
                    onChange={e => setRegForm({...regForm, name: e.target.value})} />
                </label>
                <label className="auth-label">Phone
                  <input className="auth-input" type="tel" placeholder="10-digit number"
                    value={regForm.phone}
                    onChange={e => setRegForm({...regForm, phone: e.target.value})} />
                </label>
              </div>

              <label className="auth-label">Email *
                <input className="auth-input" type="email" required placeholder="your@email.com"
                  value={regForm.email}
                  onChange={e => setRegForm({...regForm, email: e.target.value})} />
              </label>

              <div className="form-row-2">
                <label className="auth-label">Password *
                  <input className="auth-input" type="password" required placeholder="Min 6 characters"
                    value={regForm.password}
                    onChange={e => setRegForm({...regForm, password: e.target.value})} />
                </label>
                <label className="auth-label">Confirm Password *
                  <input className="auth-input" type="password" required placeholder="Repeat password"
                    value={regForm.confirmPassword}
                    onChange={e => setRegForm({...regForm, confirmPassword: e.target.value})} />
                </label>
              </div>

              {/* Student-specific */}
              {regForm.role === "student" && (
                <div className="form-row-2">
                  <label className="auth-label">College
                    <input className="auth-input" type="text" placeholder="e.g. TCE Madurai"
                      value={regForm.college}
                      onChange={e => setRegForm({...regForm, college: e.target.value})} />
                  </label>
                  <label className="auth-label">City
                    <input className="auth-input" type="text" placeholder="e.g. madurai"
                      value={regForm.city}
                      onChange={e => setRegForm({...regForm, city: e.target.value})} />
                  </label>
                </div>
              )}

              {/* Owner-specific */}
              {regForm.role === "owner" && (
                <label className="auth-label">PG / Mess Name
                  <input className="auth-input" type="text" placeholder="e.g. Sri Lakshmi PG"
                    value={regForm.pgName}
                    onChange={e => setRegForm({...regForm, pgName: e.target.value})} />
                </label>
              )}

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Creating account..." : "Create Account →"}
              </button>

              <p className="auth-switch">
                Already have an account?{" "}
                <button type="button" className="link-btn" onClick={() => setTab("login")}>
                  Login here
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}