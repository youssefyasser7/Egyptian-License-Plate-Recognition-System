import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import Navbar from "../../components/Navbar/navbar";
import "./guests.css";

function Guests() {
  const [guests, setGuests] = useState([]);
  const [carType, setCarType] = useState("");
  const [carColor, setCarColor] = useState("");
  const [firstLetter, setFirstLetter] = useState("");
  const [secondLetter, setSecondLetter] = useState("");
  const [thirdLetter, setThirdLetter] = useState("");
  const [firstNo, setFirstNo] = useState("");
  const [secondNo, setSecondNo] = useState("");
  const [thirdNo, setThirdNo] = useState("");
  const [fourthNo, setFourthNo] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // رسالة النجاح

  const token = localStorage.getItem("token");

  const fetchGuests = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/cars/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data);  // تحقق من الاستجابة هنا

      if (data && Array.isArray(data.Cars)) {
        setGuests(data.Cars.filter((car) => car.is_guest)); // فلترة العربيات اللي هي زوار
      } else {
        console.error("Unexpected response:", data);
        setGuests([]);
      }
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  // إضافة زائر
  const handleAddGuest = async () => {
    const payload = {
      car: {
        carType,
        carColor,
      },
      carNo: {
        firstLetter,
        secondLetter,
        thirdLetter,
        firstNo,
        secondNo,
        thirdNo,
        fourthNo,
      },
    };

    try {
      const response = await fetch("http://localhost:8000/api/guest/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // تفريغ الخانات بعد الإضافة
        setCarType("");
        setCarColor("");
        setFirstLetter("");
        setSecondLetter("");
        setThirdLetter("");
        setFirstNo("");
        setSecondNo("");
        setThirdNo("");
        setFourthNo("");
        fetchGuests(); // تحديث القائمة
        setSuccessMessage("Guest added successfully!"); // تعيين رسالة النجاح
        setTimeout(() => setSuccessMessage(""), 3000); // إخفاء الرسالة بعد 3 ثواني
      } else {
        console.error("Failed to add guest");
      }
    } catch (error) {
      console.error("Error adding guest:", error);
    }
  };

  return (
    <div className="pageContainer">
      <Navbar />
      <div className="mainContainer">
        <Sidebar />
        <div className="contentContainer">
          <h2 className="text-xl font-bold mb-4">Guests List</h2>

          {/* عرض رسالة النجاح */}
          {successMessage && (
            <div className="bg-green-500 text-white p-2 rounded mb-4">
              {successMessage}
            </div>
          )}

          <div className="mb-4 space-y-2">
            <input
              type="text"
              placeholder="Car Type"
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              className="border px-2 py-1 mr-2"
            />
            <input
              type="text"
              placeholder="Car Color"
              value={carColor}
              onChange={(e) => setCarColor(e.target.value)}
              className="border px-2 py-1 mr-2"
            />
            <div className="flex flex-wrap gap-2">
              <input type="text" placeholder="First Letter" value={firstLetter} onChange={(e) => setFirstLetter(e.target.value)} className="border px-2 py-1 w-24" />
              <input type="text" placeholder="Second Letter" value={secondLetter} onChange={(e) => setSecondLetter(e.target.value)} className="border px-2 py-1 w-24" />
              <input type="text" placeholder="Third Letter" value={thirdLetter} onChange={(e) => setThirdLetter(e.target.value)} className="border px-2 py-1 w-24" />
              <input type="text" placeholder="First Number" value={firstNo} onChange={(e) => setFirstNo(e.target.value)} className="border px-2 py-1 w-24" />
              <input type="text" placeholder="Second Number" value={secondNo} onChange={(e) => setSecondNo(e.target.value)} className="border px-2 py-1 w-24" />
              <input type="text" placeholder="Third Number" value={thirdNo} onChange={(e) => setThirdNo(e.target.value)} className="border px-2 py-1 w-24" />
              <input type="text" placeholder="Fourth Number" value={fourthNo} onChange={(e) => setFourthNo(e.target.value)} className="border px-2 py-1 w-24" />
            </div>
            <button onClick={handleAddGuest} className="bg-blue-500 text-white px-3 py-1 rounded">
              Add Guest
            </button>
          </div>

          <ul className="space-y-2">
            {guests.map((guest) => (
              <li key={guest.id} className="border-b py-2">
                {guest.carType} - {guest.carColor} - {guest.carNo}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Guests;
