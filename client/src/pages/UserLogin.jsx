import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userApi from "../services/userApi";

const UserLogin = ({setAuth}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApiLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await userApi.post("/auth/login", { email, password });
      const token = res.data.token;

      
        localStorage.setItem("userToken", token);

        setAuth({
  role: "user",
  isLoggedIn: true,
});

        navigate("/user/dashboard");
        return;
      

      setError("Login succeeded but token was not returned.");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Welcome back</p>
          <h1>Login to your account</h1>
        </div>

        <form onSubmit={handleApiLogin} className="auth-form">
          {error && <p className="alert error">{error}</p>}

          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              required
            />
          </label>

          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              type="password"
              required
            />
          </label>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          Don&apos;t have an account? <Link to="/user/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
