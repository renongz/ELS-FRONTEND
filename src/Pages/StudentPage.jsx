// src/Pages/StudentPage.jsx
import React from "react";

export default function StudentPage({ onLogout }) {
  const handleRemoveNotif = () => {
    if (window.confirm("Do you want to stop receiving notifications?")) {
      alert("Notifications removed!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-green-700">Student Dashboard</h1>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <button
            onClick={onLogout}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition transform hover:scale-105"
          >
            Log Out
          </button>
          <button
            onClick={handleRemoveNotif}
            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 shadow-md transition transform hover:scale-105"
          >
            Remove Notifications
          </button>
        </div>
        <p className="text-gray-500 text-sm">© 2025 Belvedere British School</p>
      </div>
    </div>
  );
}
