import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", form);

      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("admin", JSON.stringify(response.data.admin || {}));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Access</p>
          <h1>Admin Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="alert error">{error}</p>}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </label>

          <button type="submit" disabled={loading} className="primary-button">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          Need an account? <Link to="/admin/register">Create admin</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
