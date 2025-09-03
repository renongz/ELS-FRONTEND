// src/Pages/StudentPage.jsx
import { useEffect, useState } from "react";
import { registerForPushNotifications, onMessageListener } from "../firebaseConfig";

export default function StudentPage({ onLogout }) {
  const [alerts, setAlerts] = useState([]);
  const BASE_URL = "https://els-backend-43ta.onrender.com";

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/alerts`);
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error(err);
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
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    registerForPushNotifications(); // register FCM token

    onMessageListener((payload) => {
      alert(`New Alert: ${payload.notification?.title}\n${payload.notification?.body}`);
      fetchAlerts();
    });

    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-green-600">Student Alert Panel</h1>

        <div className="flex flex-col space-y-4 mb-4">
          <button
            onClick={handleUnsubscribe}
            className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600"
          >
            Remove Notifications
          </button>

          <button
            onClick={onLogout}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            Log Out
          </button>
        </div>

        <div className="mt-6 text-left">
          <h2 className="text-xl font-semibold mb-2">Alert Log</h2>
          {alerts.length === 0 ? (
            <p className="text-gray-500">No alerts yet.</p>
          ) : (
            <ul className="space-y-2">
              {alerts.map((alert) => (
                <li
                  key={alert.id}
                  className={`p-3 rounded ${
                    alert.type === "panic" ? "bg-red-100" : "bg-yellow-100"
                  }`}
                >
                  <p className="font-semibold">{alert.name}</p>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(alert.createdAt?.seconds * 1000).toLocaleString()}
                  </p>
                  <p className="text-sm font-medium">
                    Type: {alert.type === "panic" ? "Lockdown Alert" : "Suspicious Alert"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
