import express from "express";
import SensorData from "../models/SensorData.js";

const router = express.Router();

router.get("/:type", async (req, res) => {
    const type = req.params.type;
    const data = await SensorData.find({ type })
        .sort({ timestamp: -1 })
        .limit(50);
    res.json(data);
});

export default router;
