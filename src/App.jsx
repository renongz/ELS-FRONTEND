import { useEffect } from "react";
import MainPage from "./Pages/MainPage";

export default function App() {
  useEffect(() => {
    // Listen for messages from service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "play-sound") {
          const audio = new Audio(event.data.sound);
          audio.play().catch((err) => console.error("Failed to play sound:", err));
        }
      });
    }
  }, []);

  return <MainPage />;
}
