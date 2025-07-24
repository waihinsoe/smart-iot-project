import { useEffect, useState } from "react";
import socket from "../services/socket";

export default function AirQuality() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    socket.on("airquality", (data) => {
      console.log("Air Quality Data:", data);
      setValue(data.value);
    });
    return () => {
      socket.off("airquality");
    };
  }, []);

  return (
    <div>
      <h2>🏭 Air Quality</h2>
      <p>Air Index: {value}</p>
    </div>
  );
}
