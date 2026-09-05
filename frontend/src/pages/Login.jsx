import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || "/predict");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <h1 className="display" style={{ fontSize: "1.8rem", marginBottom: 20 }}>Log in</h1>
      <form onSubmit={handleSubmit} className="panel" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="field">
          <label>Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <div className="error-banner">{error}</div>}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>
          No account yet? <Link to="/register" style={{ color: "var(--accent)" }}>Sign up</Link>
        </p>
      </form>
    </div>
  );
}
