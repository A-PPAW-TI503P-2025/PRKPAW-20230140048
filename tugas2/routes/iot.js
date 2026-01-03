// routes/iot.js
const express = require("express");
const router = express.Router();
const iotController = require("../controllers/iotController");

router.post("/data", iotController.receiveSensorData);

// Endpoint React ambil data grafik (GET)
router.get("/history", iotController.getSensorHistory);

module.exports = router;
