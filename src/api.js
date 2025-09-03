// src/api.js
const BASE_URL = "https://els-backend-43ta.onrender.com";

export const registerToken = async (token) => {
  return fetch(`${BASE_URL}/api/register-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
};

export const sendAlert = async ({ type, message, name }) => {
  return fetch(`${BASE_URL}/api/send-alert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, message, name }),
  });
};

export const fetchAlerts = async () => {
  const res = await fetch(`${BASE_URL}/api/alerts`);
  return res.json();
};

export const unsubscribeDevice = async (token) => {
  return fetch(`${BASE_URL}/api/unsubscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
};
