import { useEffect, useState } from "react";
import socket from "../services/socket";

export default function MotionAlert() {
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    socket.on("pir", (data) => {
      setMotion(data.motion);
      setTimeout(() => setMotion(false), 5000); // clear after 5s
    });
    return () => {
      socket.off("pir");
    };
  }, []);

  return (
    <div>
      <h2>🛡️ Motion Detector</h2>
      <p>{motion ? "🚨 Motion Detected!" : "No Motion"}</p>
    </div>
  );
}
