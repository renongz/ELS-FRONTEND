// src/api.js
import axios from "axios";

// Replace with your backend URL
const BASE_URL = "http://localhost:5000";

// Fetch all alerts (panic + suspicious)
export const fetchAlerts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/alerts`);
    return response.data;
  } catch (err) {
    console.error("Error fetching alerts:", err);
    return [];
  }
};

// Unsubscribe the current device from receiving FCM notifications
export const unsubscribeDevice = async (token) => {
  try {
    await axios.post(`${BASE_URL}/unsubscribe`, { token });
    console.log("Device unsubscribed successfully.");
  } catch (err) {
    console.error("Error unsubscribing device:", err);
  }
};

// Optional: trigger panic or suspicious alert (for admin)
export const sendPanicAlert = async () => {
  try {
    await axios.post(`${BASE_URL}/alert/panic`);
  } catch (err) {
    console.error(err);
  }
};

export const sendSuspiciousAlert = async (message) => {
  try {
    await axios.post(`${BASE_URL}/alert/suspicious`, { message });
  } catch (err) {
    console.error(err);
  }
};
