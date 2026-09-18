import { useEffect, useState } from "react";
import userApi from "../services/userApi";

const UserProfile = () => {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // GET PROFILE
  // =========================

  const loadProfile = async () => {
    try {
      setError("");

      const response = await userApi.get("/auth/profile");

      const userData = response.data.user;

      setUser(userData);
      setName(userData.name || "");
      setEmail(userData.email || "");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const data = {
        name,
        email,
      };

      // Password empty ho to password update nahi hoga
      if (password.trim()) {
        data.password = password;
      }

      const response = await userApi.put(
        "/auth/profile",
        data
      );

      setUser(response.data.user);
      setPassword("");

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not update profile."
      );
    }
  };

  // =========================
  // DELETE ACCOUNT
  // =========================

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");

      await userApi.delete("/auth/profile");

      localStorage.removeItem("userToken");

      window.location.href = "/user/login";
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not delete account."
      );
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="user-profile">

        <h2>My Profile</h2>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

        {user && (
          <>
            <form onSubmit={handleUpdateProfile}>

            <div>
              <label>Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />
            </div>

            <div>
              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div>
              <label>New Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Leave empty to keep current password"
              />
            </div>

            <button type="submit">
              Update Profile
            </button>

          </form>

          <hr />

          <button
            type="button"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </>
        )}

    </div>
  );
};

export default UserProfile;
