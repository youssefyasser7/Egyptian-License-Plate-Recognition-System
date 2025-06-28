// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./register.css";

// export default function Register() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [password2, setPassword2] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (password !== password2) {
//       setError("Passwords do not match!");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:8000/api/accounts/register/", {
//         username,
//         email,
//         password,
//       });

//       // If successful, redirect to login
//       navigate("/login");
//     } catch (err) {
//       setError("Registration failed. Try a different username or email.");
//     }
//   };

//   return (
//     <div className="login">
//       <div className="loginWrapper">
//         <div className="loginLeft">
//           <h3 className="loginLogo">Car Plate Recognition</h3>
//           <span className="loginDesc">
//             Register to start using the car plate recognition system.
//           </span>
//         </div>
//         <div className="loginRight">
//           <div className="loginBox">
//             <input
//               placeholder="Username"
//               className="loginInput"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//             <input
//               placeholder="Email"
//               className="loginInput"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <input
//               placeholder="Password"
//               type="password"
//               className="loginInput"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <input
//               placeholder="Password Again"
//               type="password"
//               className="loginInput"
//               value={password2}
//               onChange={(e) => setPassword2(e.target.value)}
//             />
//             {error && <span className="loginError">{error}</span>}
//             <button className="loginButton" onClick={handleRegister}>
//               Sign Up
//             </button>
//             <button
//               className="loginRegisterButton"
//               onClick={() => navigate("/login")}
//             >
//               Log into Account
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }