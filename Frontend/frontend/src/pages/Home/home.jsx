import React from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import Navbar from "../../components/Navbar/navbar";  
import "./home.css";
import { Link } from "react-router-dom";  

export default function Home() {
  return (
    <div className="pageContainer">
      <Navbar />
      <div className="mainContainer">
        <Sidebar />
        <div className="contentContainer">
          <h1>Welcome to Car Plate Recognition!</h1>
          <Link to="/camera">
         <button className="goToCameraButton">Go to Camera</button>
          </Link>
          <p>You are logged in.</p>
        </div>
      </div>
    </div>
  );
}
