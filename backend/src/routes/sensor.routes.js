const express = require("express");
const router = express.Router();
const { arm, disarm, status, addReading, getHistory } = require("../controllers/sensor.controller");

router.post("/:id/arm", arm);
router.post("/:id/disarm", disarm);
router.get("/:id/status", status);
router.post("/:id/readings", addReading);
router.get("/:id/history", getHistory);

module.exports = router;