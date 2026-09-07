import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  }

  function closeMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <nav
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="page"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 24px",
          maxWidth: 1080,
        }}
      >
        <Link to="/" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoMark />
          <span className="display" style={{ fontSize: "1.3rem" }}>
            AutoPrice <span style={{ color: "var(--accent)" }}>AI</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 18, fontSize: "0.92rem" }}>
          <Link to="/predict">Predict</Link>
          <Link to="/compare">Compare</Link>
          {user && <Link to="/history">History</Link>}
          {user && <Link to="/dashboard">Dashboard</Link>}
          <button
            className="btn-secondary btn"
            style={{ padding: "6px 10px" }}
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {theme === "dark" ? "☀" : "🌙"}
          </button>
          {user ? (
            <>
              <span style={{ color: "var(--text-dim)" }}>Hi, {user.name.split(" ")[0]}</span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="mobile-nav-toggle">
          <button
            className="btn btn-secondary"
            style={{ padding: "6px 10px", fontSize: "1.1rem" }}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu"
          style={{
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <Link to="/predict" onClick={closeMenu}>Predict</Link>
          <Link to="/compare" onClick={closeMenu}>Compare</Link>
          {user && <Link to="/history" onClick={closeMenu}>History</Link>}
          {user && <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>
              {user ? `Hi, ${user.name.split(" ")[0]}` : "Theme"}
            </span>
            <button
              className="btn-secondary btn"
              style={{ padding: "6px 12px" }}
              onClick={toggleTheme}
            >
              {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
          {user ? (
            <button className="btn btn-secondary" onClick={handleLogout} style={{ width: "100%" }}>
              Log out
            </button>
          ) : (
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <Link to="/login" onClick={closeMenu} className="btn btn-secondary" style={{ flex: 1 }}>
                Log in
              </Link>
              <Link to="/register" onClick={closeMenu} className="btn btn-primary" style={{ flex: 1 }}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26">
      <path
        d="M3 18 A10 10 0 0 1 23 18"
        fill="none"
        stroke="var(--border)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M3 18 A10 10 0 0 1 17 9.5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="13" cy="18" r="2" fill="var(--accent-2)" />
    </svg>
  );
}
