import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
    type: { type: String, required: true }, // "temperature", "motion", etc.
    value: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("SensorData", sensorSchema);
