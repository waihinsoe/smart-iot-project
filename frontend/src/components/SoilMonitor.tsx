import { useEffect, useState } from "react";
import socket from "../services/socket";

export default function SoilMonitor() {
  const [moisture, setMoisture] = useState(0);

  useEffect(() => {
    socket.on("soil", (data) => {
      setMoisture(data.moisture);
    });
    return () => {
      socket.off("soil");
    };
  }, []);

  return (
    <div>
      <h2>🌱 Soil Moisture</h2>
      <p>Moisture: {moisture}</p>
    </div>
  );
}
