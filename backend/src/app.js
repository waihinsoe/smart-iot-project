import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import sensorRoutes from "./routes/sensor.routes.js";
import "./mqtt/mqttClient.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI || "")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB error", err));

app.use("/api/sensors", sensorRoutes);

export default app;
