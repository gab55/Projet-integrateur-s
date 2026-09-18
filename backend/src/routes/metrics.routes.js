const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const {getHourlyMetrics} = require("../controllers/metrics.controller");

router.get("/hourly", verifyToken, getHourlyMetrics)

module.exports = router;
