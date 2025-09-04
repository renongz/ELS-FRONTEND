// src/MainPage.jsx
import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

import AdminPage from "./AdminPage";
import StudentPage from "./StudentPage";

export default function MainPage() {
  const [page, setPage] = useState("login"); // "login" | "admin" | "student"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");

  const handleAdminLogin = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("username", "==", username),
        where("password", "==", password),
        where("role", "==", "admin")
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setLoggedInUser(username);
        alert(`Welcome ${username} to BBS - Emergency Lockdown System`);
        // Clear input fields
        setUsername("");
        setPassword("");
        setPage("admin");
      } else {
        alert("Invalid username or password");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Check console for details.");
    }
  };

  const handleStudentLogin = () => {
    setPage("student");
  };

  const handleCancel = () => {
    setUsername("");
    setPassword("");
  };

  const handleLogout = () => {
    setLoggedInUser("");
    setPage("login");
  };

  // Render AdminPage or StudentPage if logged in
  if (page === "admin")
    return <AdminPage onLogout={handleLogout} loggedInUser={loggedInUser} />;
  if (page === "student") return <StudentPage onLogout={handleLogout} />;

  // Login Form
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-4">
      {/* Logo & System Header */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="/school_logo.png"
          alt="School Logo"
          className="w-24 h-24 rounded-full object-cover mb-4 shadow-md"
        />
        <h1 className="text-3xl font-bold text-red-600 text-center">
          Belvedere British School
        </h1>
        <p className="text-gray-700 font-semibold text-center">
          Emergency Lockdown System (Web Version)
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
          Login
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleAdminLogin}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Login as Admin
          </button>

          <button
            onClick={handleStudentLogin}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
          >
            Login as Student
          </button>

          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
