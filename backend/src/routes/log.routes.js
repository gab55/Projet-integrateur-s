const express = require("express");
const router = express.Router();
const { getLogs } = require("../controllers/log.controller");
const { verifyToken, authorizeRoles } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, authorizeRoles("admin"), getLogs);

module.exports = router;