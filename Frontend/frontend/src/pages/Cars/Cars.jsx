import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import Navbar from "../../components/Navbar/navbar";
import "./cars.css";

function Cars() {
  const [cars, setCars] = useState([]);
  const [carType, setCarType] = useState("");
  const [carColor, setCarColor] = useState("");

  const [firstLetter, setFirstLetter] = useState("");
  const [secondLetter, setSecondLetter] = useState("");
  const [thirdLetter, setThirdLetter] = useState("");
  const [firstNo, setFirstNo] = useState("");
  const [secondNo, setSecondNo] = useState("");
  const [thirdNo, setThirdNo] = useState("");
  const [fourthNo, setFourthNo] = useState("");

  const [deleteId, setDeleteId] = useState("");

  const token = localStorage.getItem("token");

  const fetchCars = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/cars/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCars(data.Cars || []);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleAddCar = async () => {
    if (
      !firstLetter || !secondLetter || !thirdLetter ||
      !firstNo || !secondNo || !thirdNo || !fourthNo ||
      !carType || !carColor
    ) return;

    const body = {
      carNo: {
        firstLetter,
        secondLetter,
        thirdLetter,
        firstNo,
        secondNo,
        thirdNo,
        fourthNo,
      },
      car: {
        carType,
        carColor,
      },
    };

    await fetch("http://localhost:8000/api/cars/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    alert("✅ تمت إضافة العربية بنجاح!");

    setFirstLetter("");
    setSecondLetter("");
    setThirdLetter("");
    setFirstNo("");
    setSecondNo("");
    setThirdNo("");
    setFourthNo("");
    setCarType("");
    setCarColor("");
    fetchCars();
  };

  const handleDeleteCarById = async () => {
    if (!deleteId) return;

    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذه العربية؟")) return;

    try {
      const response = await fetch("http://localhost:8000/api/cars/delete/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: deleteId }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Delete failed:", error);
        alert("❌ حدث خطأ أثناء الحذف");
      } else {
        alert("🗑️ تم حذف العربية بنجاح!");
      }

      setDeleteId("");
      fetchCars();
    } catch (err) {
      console.error("Error deleting car:", err);
      alert("❌ حدث خطأ أثناء الاتصال بالخادم");
    }
  };

  return (
    <div className="pageContainer">
      <Navbar />
      <div className="mainContainer">
        <Sidebar />
        <div className="contentContainer">
          <h2 className="text-xl font-bold mb-4">Cars List</h2>

          {/* فورم إضافة عربية */}
          <div className="mb-4 grid grid-cols-4 gap-2">
            <input type="text" placeholder="First Letter" value={firstLetter} onChange={(e) => setFirstLetter(e.target.value)} className="border px-2 py-1" maxLength={1} />
            <input type="text" placeholder="Second Letter" value={secondLetter} onChange={(e) => setSecondLetter(e.target.value)} className="border px-2 py-1" maxLength={1} />
            <input type="text" placeholder="Third Letter" value={thirdLetter} onChange={(e) => setThirdLetter(e.target.value)} className="border px-2 py-1" maxLength={1} />
            <input type="text" placeholder="First Number" value={firstNo} onChange={(e) => setFirstNo(e.target.value)} className="border px-2 py-1" maxLength={1} />
            <input type="text" placeholder="Second Number" value={secondNo} onChange={(e) => setSecondNo(e.target.value)} className="border px-2 py-1" maxLength={1} />
            <input type="text" placeholder="Third Number" value={thirdNo} onChange={(e) => setThirdNo(e.target.value)} className="border px-2 py-1" maxLength={1} />
            <input type="text" placeholder="Fourth Number" value={fourthNo} onChange={(e) => setFourthNo(e.target.value)} className="border px-2 py-1" maxLength={1} />
            <input type="text" placeholder="Car Type" value={carType} onChange={(e) => setCarType(e.target.value)} className="border px-2 py-1" />
            <input type="text" placeholder="Car Color" value={carColor} onChange={(e) => setCarColor(e.target.value)} className="border px-2 py-1" />
            <button onClick={handleAddCar} className="bg-blue-500 text-white px-3 py-1 rounded col-span-2">
              Add Car
            </button>
          </div>

          {/* فورم حذف عربية عن طريق ID */}
          <div className="mb-6 flex gap-2">
            <input
              type="number"
              placeholder="Enter Car ID to delete"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
              className="border px-3 py-2 rounded w-60"
            />
            <button
              onClick={handleDeleteCarById}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>

          {/* قائمة العربيات */}
          <ul className="space-y-2">
            {cars.map((car) => (
              <li key={car.id} className="flex justify-between items-center border p-2 rounded">
                <span>{car.plate}</span>
                <span className="text-gray-500 text-sm">ID: {car.id}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cars;
