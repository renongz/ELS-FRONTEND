// src/Pages/AdminPage.jsx (Batch 1)
import { useState, useEffect } from "react";
import { registerForPushNotifications, onMessageListener } from "../firebaseConfig";

export default function AdminPage({ onLogout, loggedInUser }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [suspiciousMessage, setSuspiciousMessage] = useState("");
  const [panicDisabled, setPanicDisabled] = useState(false);
  const [clearDisabled, setClearDisabled] = useState(false);

  const BASE_URL = "https://els-backend-43ta.onrender.com";

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "Unknown date/time";
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleString();
    return new Date(timestamp).toLocaleString();
  };

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/alerts`);
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    }
  };

  const sendAlert = async (type, message) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/send-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, name: "Admin", message }),
      });
      if (res.ok) {
        fetchAlerts();
        setSuspiciousMessage("");
        setModalOpen(false);
        alert("Alert sent successfully!");
      } else {
        alert("Failed to send alert. Check backend logs.");
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
    setPanicDisabled(true);
    setTimeout(() => setPanicDisabled(false), 300000);
    //const audio = new Audio("/pani.mp3");
    //audio.play();
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
    setClearDisabled(true);
    setTimeout(() => setClearDisabled(false), 300000);
    try {
      await fetch(`${BASE_URL}/api/clear-alerts`, { method: "POST" });
      fetchAlerts();
      alert("Alerts cleared");
    } catch (err) {
      console.error(err);
      alert("Failed to clear alerts");
    }
  };

  useEffect(() => {
  fetchAlerts();
  registerForPushNotifications();

  // Listen for foreground push messages
  const unsubscribeOnMessage = onMessageListener((payload) => {
    // Play sound if panic alert
    const alertType = payload.data?.type;
    if (alertType === "panic") {
      const audio = new Audio("/pani.mp3"); // must exist in public/
      audio.play().catch(err => console.error("Audio play failed", err));
    }

    // Show notification alert
    alert(`New Alert: ${payload.notification?.title}\n${payload.notification?.body}`);
    
    // Refresh the alert list only when a new alert is received
    fetchAlerts();
  });

  // Listen for service worker messages (optional)
  const handleSWMessage = (event) => {
    if (event.data?.type === "play-sound") {
      const audio = new Audio(event.data.sound);
      audio.play();
    }
  };
  navigator.serviceWorker.addEventListener("message", handleSWMessage);

  // Cleanup on unmount
  return () => {
    navigator.serviceWorker.removeEventListener("message", handleSWMessage);
    if (unsubscribeOnMessage) unsubscribeOnMessage();
  };
}, []);




  return (
  <div className="min-h-screen flex flex-col items-center bg-black p-4">
    {/* Header */}
    <header className="w-full max-w-6xl flex items-center justify-between bg-white rounded-xl shadow-lg p-4 mb-6">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <img
          src="/school_logo.png"
          alt="School Logo"
          className="w-16 h-16 " ///rounded-full object-cover
        />
        {/* School & System Name */}
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Belvedere British School</h1>
          <p className="text-sm text-gray-700 font-semibold">Emergency Lockdown System</p>
        </div>
      </div>

      {/* Logout Button and Logged-in User */}
      <div className="flex flex-col items-end">
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Logout
        </button>

        {/* Logged-in user label */}
        {loggedInUser && (
          <span className="text-gray-700 text-sm mt-1">Logged in as: {loggedInUser}</span>
        )}
      </div>
    </header>


      {/* Main Content */}
      <div className="flex w-full max-w-6xl space-x-6">
        {/* Left column: Buttons Panel */}
        <div className="flex flex-col space-y-4 w-1/3 bg-white rounded-xl shadow-lg p-6">
          <button
            disabled={panicDisabled || loading}
            onClick={handlePanic}
            className="px-6 py-6 bg-red-600 text-white font-bold text-lg rounded-xl hover:bg-red-700 disabled:opacity-50"
          >
            Panic Alert
          </button>

          <div className="flex flex-col space-y-2 mt-4">
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 text-sm"
            >
              Send Suspicious Alert
            </button>

            <button
              disabled={clearDisabled}
              onClick={handleClear}
              className="px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 text-sm"
            >
              Clear Alerts
            </button>
          </div>
        </div>


        {/* Right column: Alert Log Table */}
                    <div className="w-2/3 bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-red-600">Alert Log</h2>
                        <button
                          onClick={fetchAlerts}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                        >
                          Refresh
                        </button>
                      </div>

                      {alerts.length === 0 ? (
                        <p className="text-gray-500">No alerts yet.</p>
                      ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Message</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date & Time</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type of Alert</th>
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
                                <td className="px-4 py-2 text-sm text-gray-800">{alert.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{alert.message}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{formatDateTime(alert.createdAt)}</td>
                                <td className="px-4 py-2 text-sm font-semibold text-gray-800">
                                  {alert.type === "panic" ? "Lockdown Alert" : "Suspicious Alert"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>


        
      </div>
      {/* Suspicious Alert Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Suspicious Alert</h2>
            <textarea
              value={suspiciousMessage}
              onChange={(e) => setSuspiciousMessage(e.target.value)}
              placeholder="Enter suspicious message"
              className="p-2 border rounded w-full mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={handleSuspicious}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Send
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
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
