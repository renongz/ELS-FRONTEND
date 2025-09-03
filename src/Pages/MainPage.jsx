// src/Pages/MainPage.jsx
import { useState } from "react";
import AdminPage from "./AdminPage";
import StudentPage from "./StudentPage";

export default function MainPage() {
  const [view, setView] = useState(null);

  const handleBack = () => setView(null);

  if (!view) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-200 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
            Emergency Lockdown System
          </h1>
          <p className="text-gray-700 mb-8">
            Select your access to continue:
          </p>
          <div className="flex flex-col gap-5">
            <button
              onClick={() => setView("admin")}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition transform hover:scale-105 shadow-md"
            >
              Admin
            </button>
            <button
              onClick={() => setView("student")}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition transform hover:scale-105 shadow-md"
            >
              Student
            </button>
          </div>
        </div>
        <p className="mt-8 text-gray-600 text-sm">
          © 2025 Belvedere British School
        </p>
      </div>
    );
  }

  if (view === "admin") return <AdminPage onLogout={handleBack} />;
  if (view === "student") return <StudentPage onLogout={handleBack} />;
}
