import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import Navbar from "../../components/Navbar/navbar";

function Users() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
    age: "",
    type: "carHolder",
  });

  const [carData, setCarData] = useState({
    firstLetter: "",
    secondLetter: "",
    thirdLetter: "",
    firstNo: "",
    secondNo: "",
    thirdNo: "",
    fourthNo: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCarChange = (e) => {
    setCarData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload =
      formData.type === "carHolder"
        ? {
            user: formData,
            carNo: carData,
          }
        : { user: formData };
  
    const token = localStorage.getItem("token"); // جيب التوكن من localStorage
  
    try {
      const res = await fetch("http://localhost:8000/api/accounts/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // هنا أضفنا التوكن
        },
        body: JSON.stringify(payload),
      });
  
      if (res.ok) {
        const result = await res.json();
        alert("User registered successfully");
        console.log(result);
      } else {
        const error = await res.json();
        console.error(error);
        alert("Error registering user");
      }
    } catch (err) {
      console.error("Request failed", err);
    }
  };
  

  return (
    <div className="pageContainer">
      <Navbar />
      <div className="mainContainer">
        <Sidebar />
        <div className="contentContainer p-4">
          <h2 className="text-2xl font-bold mb-4">Add New User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="border px-3 py-2 w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="border px-3 py-2 w-full"
              required
            />
            <input
              type="password"
              name="password1"
              placeholder="Password"
              onChange={handleChange}
              className="border px-3 py-2 w-full"
              required
            />
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="border px-3 py-2 w-full"
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              onChange={handleChange}
              className="border px-3 py-2 w-full"
              required
            />
            <select
              name="type"
              onChange={handleChange}
              className="border px-3 py-2 w-full"
            >
              <option value="carHolder">Car Holder</option>
              <option value="admin">Admin</option>
              <option value="security">Security</option>
            </select>

            {formData.type === "carHolder" && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Car Info</h3>
                <input
                  type="text"
                  name="firstLetter"
                  placeholder="First Letter"
                  onChange={handleCarChange}
                  className="border px-3 py-2 w-full"
                />
                <input
                  type="text"
                  name="secondLetter"
                  placeholder="Second Letter"
                  onChange={handleCarChange}
                  className="border px-3 py-2 w-full"
                />
                <input
                  type="text"
                  name="thirdLetter"
                  placeholder="Third Letter"
                  onChange={handleCarChange}
                  className="border px-3 py-2 w-full"
                />
                <input
                  type="text"
                  name="firstNo"
                  placeholder="First Number"
                  onChange={handleCarChange}
                  className="border px-3 py-2 w-full"
                />
                <input
                  type="text"
                  name="secondNo"
                  placeholder="Second Number"
                  onChange={handleCarChange}
                  className="border px-3 py-2 w-full"
                />
                <input
                  type="text"
                  name="thirdNo"
                  placeholder="Third Number"
                  onChange={handleCarChange}
                  className="border px-3 py-2 w-full"
                />
                <input
                  type="text"
                  name="fourthNo"
                  placeholder="Fourth Number"
                  onChange={handleCarChange}
                  className="border px-3 py-2 w-full"
                />
              </div>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Register User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Users;
