// import React from "react";

// const AdminDashboard = () => {
//   return (
//     <div className="dashboard">
//       <h1>Admin Dashboard</h1>

//       <div className="stats-grid">
//         <div className="stat-card">
//           <h3>Total Users</h3>
//           <p>120</p>
//         </div>

//         <div className="stat-card">
//           <h3>Active Users</h3>
//           <p>100</p>
//         </div>

//         <div className="stat-card">
//           <h3>Blocked Users</h3>
//           <p>20</p>
//         </div>

//         <div className="stat-card">
//           <h3>Total Admins</h3>
//           <p>2</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const emptyForm = { name: "", email: "", password: "" };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalAdmins: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/users"),
      ]);

      setStats(statsRes.data.stats || {});
      setUsers(usersRes.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = { ...form };

      if (editingId) {
        if (!payload.password) delete payload.password;
        await api.put(`/users/${editingId}`, payload);
      } else {
        await api.post("/users", payload);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id || user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
    });
  };

  const handleToggleBlock = async (userId) => {
    try {
      await api.patch(`/users/${userId}/block`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update block state.");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/users/${userId}`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete the user.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  if (loading) {
    return <div className="loading-screen">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Workspace</p>
          <h2>Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-item active">Dashboard</span>
          <span className="nav-item">Users</span>
       
        </nav>

        <button type="button" onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Dashboard</h1>
          </div>
          <div className="admin-badge">Admin Access</div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Users</span>
            <strong>{stats.totalUsers || 0}</strong>
          </div>
          <div className="stat-card success">
            <span>Active Users</span>
            <strong>{stats.activeUsers || 0}</strong>
          </div>
          <div className="stat-card danger">
            <span>Blocked Users</span>
            <strong>{stats.blockedUsers || 0}</strong>
          </div>
          <div className="stat-card primary">
            <span>Total Admins</span>
            <strong>{stats.totalAdmins || 0}</strong>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>{editingId ? "Edit User" : "Create User"}</h3>
            {editingId && (
              <button type="button" onClick={resetForm} className="secondary-button">
                Cancel
              </button>
            )}
          </div>

          {error && <p className="alert error">{error}</p>}

          <form onSubmit={handleSubmit} className="user-form">
            <label>
              Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Full name"
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleFormChange}
                placeholder="email@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleFormChange}
                placeholder={editingId ? "Leave blank to keep current password" : "Create password"}
                required={!editingId}
              />
            </label>

            <button type="submit" disabled={submitting} className="primary-button">
              {submitting ? "Saving..." : editingId ? "Update User" : "Create User"}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>Users</h3>
            <span>{users.length} members</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const userId = user._id || user.id;
                  const isBlocked = Boolean(user.isBlocked);

                  return (
                    <tr key={userId}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`status-badge ${isBlocked ? "blocked" : "active"}`}>
                          {isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                  
                      <td className="table-actions">
                        <button type="button" onClick={() => handleEdit(user)} className="secondary-button small">
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(userId)}
                          className={`secondary-button small ${isBlocked ? "warning" : ""}`}
                        >
                          {isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button type="button" onClick={() => handleDelete(userId)} className="danger-button small">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
