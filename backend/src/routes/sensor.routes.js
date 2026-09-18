const express = require("express");
const router = express.Router();
const { arm, disarm, status, addReading, getHistory, registerSensor, getSensors} = require("../controllers/sensor.controller");
const {checkSensorAccess} = require('../middlewares/sensorAccess.middleware');
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, getSensors)

router.post("/new", verifyToken, registerSensor)
router.post("/:id/arm", verifyToken, checkSensorAccess, arm);
router.post("/:id/disarm", verifyToken, checkSensorAccess, disarm);
router.get("/:id/status", verifyToken, checkSensorAccess, status);
router.post("/:id/readings", verifyToken, checkSensorAccess, addReading);
router.get("/:id/history", verifyToken, checkSensorAccess, getHistory);

module.exports = router;