import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import Navbar from "../../components/Navbar/navbar";
import "./logs.css";

function Logs() {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/logs/");
      const data = await res.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="pageContainer">
      <Navbar />
      <div className="mainContainer">
        <Sidebar />
        <div className="contentContainer">
          <h2 className="text-xl font-bold mb-4">Car Entry/Exit Logs</h2>

          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Plate</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td className="border p-2">{log.plate}</td>
                  <td className="border p-2">{log.type}</td>
                  <td className="border p-2">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Logs;
