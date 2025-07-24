import { useState } from "react";
import axios from "axios";

export default function LedControl() {
  const [color, setColor] = useState({ r: 255, g: 0, b: 0 });

  const sendColor = async () => {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/mqtt`, {
      topic: "esp32/led/control",
      message: color,
    });
  };

  return (
    <div>
      <h2>💡 RGB LED Control</h2>
      <input
        type="color"
        onChange={(e) => {
          const hex = e.target.value;
          const r = parseInt(hex.substring(1, 3), 16);
          const g = parseInt(hex.substring(3, 5), 16);
          const b = parseInt(hex.substring(5, 7), 16);
          setColor({ r, g, b });
        }}
      />
      <button onClick={sendColor}>Send Color</button>
    </div>
  );
}
