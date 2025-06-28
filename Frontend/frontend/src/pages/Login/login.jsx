import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";
// import { Token } from "@mui/icons-material";
import {jwtDecode} from 'jwt-decode';

export default function Login() {
  const [username, setUsername] = useState(""); // 👈 username بدل email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/accounts/token/", {
        username,
        password,
      });
      // localStorage.setItem("token", response.data.access);
      const token =response.data.access;
      localStorage.setItem("token", response.data.access);

      const decoded = jwtDecode(token)
      console.log(decoded);
      localStorage.setItem("userId", decoded.user_id)
      localStorage.setItem("userType", response.data.userType)
      console.log(response.data)
      navigate("/home");
    } catch (err) {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Car Plate Recognition</h3>
          <span className="loginDesc">
            Login to your admin account to manage the system.
          </span>
        </div>
        <div className="loginRight">
          <div className="loginBox">
            <input
              placeholder="username"
              name="username"
              className="loginInput"
              // value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              placeholder="Password"
              name="name"
              className="loginInput"
              type="password"
              // value={password}
              // name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <span className="loginError">{error}</span>}
            <button className="loginButton" onClick={handleLogin}>
              Log In
            </button>
            {/* <span
            className="loginForgot"
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => navigate("/change-password")}
            >
            Change Password?
            </span> */}


            {/*  Register */}
            {/* <button className="loginRegisterButton" onClick={() => navigate("/register")}>
              Create a New Account
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
