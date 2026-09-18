import { useEffect, useState } from "react";
import userApi from "../services/userApi";

const UserDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    setError("");
    try {
      const res = await userApi.get("/auth/profile");
      setProfile(res.data.user || res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) return <div className="loading-screen">Loading profile...</div>;

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
          <div>
            <p className="eyebrow">Account</p>
            <h2>User</h2>
          </div>

          <nav className="sidebar-nav">
            <span className="nav-item active">Dashboard</span>
          </nav>
        </aside>

        <main className="dashboard-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Your profile</p>
            <h1>Welcome</h1>
          </div>
        </header>

        <section className="panel">
          {error && <p className="alert error">{error}</p>}

          {profile ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div><strong>Name:</strong> {profile.name}</div>
              <div><strong>Email:</strong> {profile.email}</div>
              <div><strong>Role:</strong> {profile.role || "user"}</div>
              <div><strong>Created:</strong> {profile.createdAt || profile.created_at || "-"}</div>
            </div>
          ) : (
            <div>No profile data</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;

