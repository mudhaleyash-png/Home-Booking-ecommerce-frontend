import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { currentUser, userProfileUpdate } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("");
    try {
      await userProfileUpdate(email);
      setStatusMsg("Email updated successfully!");
    } catch (error) {
      setStatusMsg("Failed to update email: " + error.message);
    }
  };

  if (!currentUser) return <p>Loading user data...</p>;

  return (
    <div className="profile-page">
      <h2>Update Profile</h2>
      {statusMsg && <div className="status-message">{statusMsg}</div>}
      <form onSubmit={handleSubmit} className="profile-form">
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default ProfilePage;
