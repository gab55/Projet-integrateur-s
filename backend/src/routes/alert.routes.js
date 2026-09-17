const express = require("express");
const router = express.Router();
const { getAlerts, getOneAlert, newAlert, resolveAlert, alertStatus} = require("../controllers/alerts.controller");
const { checkAlertAccess } = require("../middlewares/alertAccess.middleware")
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, getAlerts)
router.get("/:id", verifyToken, checkAlertAccess, getOneAlert)
router.post("/start", verifyToken, newAlert);
router.post("/:id/resolve", verifyToken, checkAlertAccess, resolveAlert);
router.get("/:id/status", verifyToken, checkAlertAccess, alertStatus);

module.exports = router;
