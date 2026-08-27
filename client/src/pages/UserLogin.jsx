import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../services/userApi";

const UserLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApiLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Attempt API login. Depending on your backend, this may require no auth middleware.
      const res = await userApi.post("/auth/login", { email, password });
      const t = res.data.token;
      if (t) {
        localStorage.setItem("userToken", t);
        navigate("/user/dashboard");
      } else {
        setError("Login succeeded but token not returned.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUseToken = (e) => {
    e.preventDefault();
    if (!tokenInput) {
      setError("Paste a token or use API login.");
      return;
    }
    localStorage.setItem("userToken", tokenInput.trim());
    navigate("/user/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">User Access</p>
          <h1>User Login</h1>
        </div>

        <form onSubmit={handleApiLogin} className="auth-form">
          {error && <p className="alert error">{error}</p>}

          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" />
          </label>

          <label>
            Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
          </label>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Login via API"}
          </button>
        </form>

        <hr style={{ margin: "18px 0", borderColor: "rgba(148,163,184,0.08)" }} />

        <form onSubmit={handleUseToken} className="auth-form">
          <label>
            Paste token (manual)
            <input value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="paste token here" />
          </label>

          <button type="submit" className="secondary-button">Use Token</button>
        </form>

      </div>
    </div>
  );
};

export default UserLogin;
