// src/Pages/AdminPage.jsx
import { useState, useEffect } from "react";
import { registerForPushNotifications, onMessageListener } from "../firebaseConfig";

export default function AdminPage({ onLogout }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [suspiciousMessage, setSuspiciousMessage] = useState("");

  const BASE_URL = "https://els-backend-43ta.onrender.com";

  // Helper to format Firestore timestamp
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "Unknown date/time";
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    // fallback if already a JS Date or string
    return new Date(timestamp).toLocaleString();
  };

  // Fetch alerts from backend
  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/alerts`);
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    registerForPushNotifications();

    // Listen for incoming FCM messages
    onMessageListener((payload) => {
      console.log("FCM message received:", payload);
      fetchAlerts(); // Update alert list immediately
      alert(`New Alert: ${payload.notification?.title}\n${payload.notification?.body}`);
    });
  }, []);

  const sendAlert = async (type, message) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/send-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, name: "Admin", message }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAlerts();
        setSuspiciousMessage("");
        setModalOpen(false);
        alert("Alert sent successfully!");
      } else {
        alert("Failed to send alert");
      }
    } catch (err) {
      console.error("Error sending alert:", err);
      alert("Error sending alert");
    } finally {
      setLoading(false);
    }
  };

  const handlePanic = () => {
    if (!window.confirm("Send Lockdown Alert to all devices?")) return;

    // Play panic audio
    const audio = new Audio("/pani.mp3");
    audio.play();

    // Send alert
    sendAlert(
      "panic",
      "This is a Lockdown. Please follow the Lockdown Procedure Immediately."
    );
  };

  const handleSuspicious = () => {
    if (!suspiciousMessage.trim()) {
      alert("Please enter a message for suspicious alert");
      return;
    }
    if (!window.confirm("Send Suspicious Alert to all devices?")) return;
    sendAlert("suspicious", suspiciousMessage);
  };

  const handleClear = async () => {
    if (!window.confirm("Clear all alerts?")) return;
    try {
      await fetch(`${BASE_URL}/api/clear-alerts`, { method: "POST" });
      fetchAlerts();
      alert("Alerts cleared");
    } catch (err) {
      console.error(err);
      alert("Failed to clear alerts");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-red-600">Admin Panel</h1>

        <div className="flex flex-col space-y-4 mb-4">
          <button
            disabled={loading}
            onClick={handlePanic}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
          >
            Panic Alert
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600"
          >
            Send Suspicious Alert
          </button>

          <button
            onClick={handleClear}
            className="px-6 py-3 bg-gray-400 text-white font-semibold rounded hover:bg-gray-500"
          >
            Clear Alerts
          </button>

          <button
            onClick={onLogout}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            Log Out
          </button>
        </div>

        {/* Alert List */}
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
                    {formatDateTime(alert.createdAt)}
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

      {/* Suspicious Alert Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold mb-4">Suspicious Alert</h2>
            <textarea
              value={suspiciousMessage}
              onChange={(e) => setSuspiciousMessage(e.target.value)}
              placeholder="Enter suspicious message"
              className="p-2 border rounded w-full mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={handleSuspicious}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Send
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
