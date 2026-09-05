import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/predict");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <h1 className="display" style={{ fontSize: "1.8rem", marginBottom: 20 }}>
        Create your account
      </h1>
      <form
        onSubmit={handleSubmit}
        className="panel"
        style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div className="field">
          <label>Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {error && <div className="error-banner">{error}</div>}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
        <p style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)" }}>
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
