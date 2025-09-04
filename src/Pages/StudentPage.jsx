// src/Pages/StudentPage.jsx
import { useEffect, useState } from "react";
import { registerForPushNotifications, onMessageListener } from "../firebaseConfig";

export default function StudentPage({ onLogout, loggedInUser }) {
  const [alerts, setAlerts] = useState([]);
  const BASE_URL = "https://els-backend-43ta.onrender.com";

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/alerts`);
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    }
  };

  const handleUnsubscribe = async () => {
    if (!window.confirm("Do you want to stop receiving alerts?")) return;

    const token = localStorage.getItem("fcm_token");
    if (!token) return;

    try {
      await fetch(`${BASE_URL}/api/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      alert("You will no longer receive alerts.");
      localStorage.removeItem("fcm_token");
    } catch (err) {
      console.error("Failed to unsubscribe:", err);
    }
  };

    useEffect(() => {
    fetchAlerts();
    registerForPushNotifications(); // register FCM token

    onMessageListener((payload) => {
      alert(`New Alert: ${payload.notification?.title}\n${payload.notification?.body}`);
      fetchAlerts();

      // Play sound if it's a panic alert
      if (payload?.data?.type === "panic" || payload?.notification?.title?.toLowerCase().includes("lockdown")) {
        const audio = new Audio("/pani.mp3");
        audio.play().catch((err) => console.error("Audio play failed:", err));
      }
    });

    const interval = setInterval(fetchAlerts, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-50 p-4">
      {/* Header */}
      <header className="w-full max-w-6xl flex items-center justify-between bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <img
            src="/school_logo.png"
            alt="School Logo"
            className="w-16 h-16 " //rounded-full object-cover
          />
          {/* School & System Name */}
          <div>
            <h1 className="text-2xl font-bold text-red-600">Belvedere British School</h1>
            <p className="text-sm text-gray-700 font-semibold">Emergency Lockdown System</p>
          </div>
        </div>

        {/* Right Side: Buttons + Logged in User */}
        <div className="flex flex-col items-end space-y-2">
          <button
            onClick={handleUnsubscribe}
            className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 text-sm"
          >
            Remove Notifications
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 text-sm"
          >
            Logout
          </button>
          {loggedInUser && (
            <span className="text-gray-700 text-sm">{loggedInUser}</span>
          )}
        </div>
      </header>

      {/* Alert Log Section */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600">Alert Log</h2>
          <button
            onClick={fetchAlerts}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 text-sm"
          >
            Refresh
          </button>
        </div>

        {alerts.length === 0 ? (
          <p className="text-gray-500">No alerts yet.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Message</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Date & Time</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Type of Alert</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className={
                    alert.type === "panic"
                      ? "bg-red-100"
                      : alert.type === "suspicious"
                      ? "bg-yellow-100"
                      : "bg-white"
                  }
                >
                  <td className="px-4 py-2">{alert.name}</td>
                  <td className="px-4 py-2">{alert.message}</td>
                  <td className="px-4 py-2">
                    {alert.createdAt?.seconds
                      ? new Date(alert.createdAt.seconds * 1000).toLocaleString()
                      : "Unknown"}
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    {alert.type === "panic" ? "Lockdown Alert" : "Suspicious Alert"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
