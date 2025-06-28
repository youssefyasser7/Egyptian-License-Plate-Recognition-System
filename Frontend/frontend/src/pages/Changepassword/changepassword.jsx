import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./changepassword.css";

export default function ChangePassword() {
  const [username, setUsername] = useState(""); 
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    // if (!token) {
    //   setError("Please login first.");
    //   return;
    // }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/accounts/change_password/",
        {
          username,
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("✅ Password changed successfully.");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("❌ Error changing password, please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="changePassword">
      <form onSubmit={handleChangePassword}>
        <h2>Change User Password</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}
