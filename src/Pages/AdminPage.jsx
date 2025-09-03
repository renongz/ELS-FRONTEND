// src/Pages/AdminPage.jsx
import React from "react";

export default function AdminPage({ onLogout }) {
  const handlePanic = () => {
    if (window.confirm("Send PANIC alert to all devices?")) {
      const audio = new Audio("/alert_sound.mp3");
      audio.play();
      alert("Panic alert sent!");
    }
  };

  const handleSuspicious = () => {
    if (window.confirm("Send SUSPICIOUS alert to all devices?")) {
      alert("Suspicious alert sent!");
    }
  };

  const handleClear = () => {
    if (window.confirm("Clear all alerts?")) {
      alert("Alerts cleared!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-red-700">Admin Dashboard</h1>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <button
            onClick={handlePanic}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 shadow-md transition transform hover:scale-105"
          >
            Panic Alert
          </button>
          <button
            onClick={handleSuspicious}
            className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 shadow-md transition transform hover:scale-105"
          >
            Suspicious Alert
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 shadow-md transition transform hover:scale-105"
          >
            Clear Alerts
          </button>
          <button
            onClick={onLogout}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition transform hover:scale-105"
          >
            Log Out
          </button>
        </div>
        <p className="text-gray-500 text-sm">© 2025 Belvedere British School</p>
      </div>
    </div>
  );
}
