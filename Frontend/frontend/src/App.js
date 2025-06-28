import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Home from "./pages/Home/home.jsx";
import Login from "./pages/Login/login.jsx";
import Register from "./pages/Register/register.jsx";
import Users from "./pages/Users/users.jsx";
import Cars from "./pages/Cars/Cars.jsx";
import Guests from "./pages/Guests/guests.jsx";
import Blacklist from "./pages/Blacklist/blacklist.jsx";
import Logs from "./pages/Logs/logs.jsx";
import Camera from "./pages/Camera/camera.jsx";
import ChangePassword from "./pages/Changepassword/changepassword.jsx"; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/guests" element={<Guests />} />
        <Route path="/blacklist" element={<Blacklist />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </Router>
  );
}

export default App;
