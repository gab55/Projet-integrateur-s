const express = require("express");
const router = express.Router();
const { getAlerts, getOneAlert, newAlert, resolveAlert, alertStatus} = require("../controllers/alerts.controller");

const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, getAlerts)
router.get("/:id", verifyToken, getOneAlert)
router.post("/start", verifyToken, newAlert);
router.post("/:id/resolve", verifyToken, resolveAlert);
router.get("/:id/status", verifyToken, alertStatus);

module.exports = router;