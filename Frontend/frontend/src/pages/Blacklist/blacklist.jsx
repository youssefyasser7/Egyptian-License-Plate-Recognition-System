import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import Navbar from "../../components/Navbar/navbar";
import "./blacklist.css";

function Blacklist() {
  const [cars, setCars] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [plate, setPlate] = useState("");
  const [reason, setReason] = useState("");

  const fetchCars = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/cars/");
      const data = await res.json();
      setCars(data.Cars || []);
      const blacklisted = (data.Cars || []).filter((car) => car.is_blacklisted);
      setBlacklist(blacklisted);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleAdd = async () => {
    if (!plate.trim() || !reason.trim()) return;

    // Remove spaces but preserve Arabic characters
    const normalizedPlate = plate.replace(/\s/g, "");
    const targetCar = cars.find((car) =>
      car.fullNo.join("") === normalizedPlate
    );

    if (!targetCar) {
      alert("Car not found with that plate.");
      return;
    }

    await fetch("http://localhost:8000/api/blacklist/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        car: targetCar.id,
        reason: reason,
      }),
    });

    setPlate("");
    setReason("");
    fetchCars();
  };

  const handleDelete = async (carId) => {
    await fetch("http://localhost:8000/api/blacklist/delete/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ car: carId, user: null }),
    });

    fetchCars();
  };

  return (
    <div className="pageContainer">
      <Navbar />
      <div className="mainContainer">
        <Sidebar />
        <div className="contentContainer">
          <h2 className="text-xl font-bold mb-4">Blacklist</h2>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Car id"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="border px-2 py-1 mr-2"
            />
            <input
              type="text"
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border px-2 py-1 mr-2"
            />
            <button
              onClick={handleAdd}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Add to Blacklist
            </button>
          </div>

          <ul className="space-y-2">
            {blacklist.map((car) => (
              <li
                key={car.id}
                className="border p-2 rounded flex justify-between items-center"
              >
                <span>{car.plate}</span>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Blacklist;
