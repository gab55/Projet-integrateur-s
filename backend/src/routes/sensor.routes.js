const express = require("express");
const router = express.Router();
const { arm, disarm, status, addReading, getHistory, registerSensor, getSensors} = require("../controllers/sensor.controller");

const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, getSensors)

router.post("/new", verifyToken, registerSensor)
router.post("/:id/arm", verifyToken, arm);
router.post("/:id/disarm", verifyToken, disarm);
router.get("/:id/status", verifyToken, status);
router.post("/:id/readings", verifyToken, addReading);
router.get("/:id/history", verifyToken, getHistory);

module.exports = router;