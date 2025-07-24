import TemperatureHumidity from "./components/TemperatureHumidity";
import LedControl from "./components/LedControl";
import SoilMonitor from "./components/SoilMonitor";
import AirQuality from "./components/AirQuality";
import MotionAlert from "./components/MotionAlert";

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🌐 Smart Environment Dashboard</h1>
      <TemperatureHumidity />
      <LedControl />
      <SoilMonitor />
      <MotionAlert />
      <AirQuality />
    </div>
  );
}

export default App;
