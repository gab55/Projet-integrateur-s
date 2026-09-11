const express = require("express");
const router = express.Router();
const { arm, disarm, status } = require("../controllers/sensor.controller");

router.post("/:id/arm", arm);
router.post("/:id/disarm", disarm);
router.get("/:id/status", status);

module.exports = router;