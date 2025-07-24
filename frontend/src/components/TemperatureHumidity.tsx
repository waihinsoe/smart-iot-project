import { useEffect, useState } from "react";
import socket from "../services/socket";

export default function TemperatureHumidity() {
  const [data, setData] = useState({ temp: 0, humidity: 0 });

  useEffect(() => {
    socket.on("dht22", (payload) => {
      setData(payload);
    });
    return () => {
      socket.off("dht22");
    };
  }, []);

  return (
    <div>
      <h2>🌡️ Temperature & Humidity</h2>
      <p>Temperature: {data.temp} °C</p>
      <p>Humidity: {data.humidity} %</p>
    </div>
  );
}
