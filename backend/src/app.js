import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import sensorRoutes from "./routes/sensor.routes.js";
import "./mqtt/mqttClient.js";
import { client } from "./mqtt/mqttClient.js"; // Import the MQTT client
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/hello", (req, res) => {
  res.send("Welcome to the Sensor API");
});

app.post("/api/mqtt", (req, res) => {
  const { topic, message } = req.body;
  if (!topic || !message) {
    return res.status(400).json({ error: "Topic and message are required" });
  }

  // Here you would publish the message to the MQTT broker
  console.log(`Publishing to ${topic}:`, message);
  // For demonstration, we just log it
  // In a real application, you would use the MQTT client to publish
  client.publish(topic, JSON.stringify(message)); // Uncomment this line to publish to MQTT broker
  res.status(200).json({ success: true, topic, message });
});

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error", err));

app.use("/api/sensors", sensorRoutes);

export default app;
