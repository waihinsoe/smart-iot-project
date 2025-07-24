import mqtt from "mqtt";
import dotenv from "dotenv";
import SensorData from "../models/SensorData.js";
import { sendToClients } from "../sockets/socket.js";

dotenv.config();

export const client = mqtt.connect(process.env.MQTT_BROKER);

const topics = [
  "esp32/dht22/data",
  "esp32/led/status",
  "esp32/soil/data",
  "esp32/pir/motion",
  "esp32/airquality/data",
];

client.on("connect", () => {
  console.log("MQTT Connected");
  client.subscribe(topics);
});

client.on("message", async (topic, payload) => {
  try {
    console.log(topic, payload.toString());
    const message = JSON.parse(payload.toString());
    const type = topic.split("/")[1]; // e.g., "dht22"
    const doc = new SensorData({ type, value: message });
    await doc.save();
    sendToClients(type, message); // send to React via socket
  } catch (err) {
    console.error("MQTT Message Error:", err);
  }
});

export default client;
