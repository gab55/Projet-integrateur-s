const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const alarmController = require('../controllers/alarm.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const alarmRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/arm', alarmRateLimit, verifyToken, (req, res) =>
  alarmController.armSystem(req, res)
);

router.post('/disarm', alarmRateLimit, verifyToken, (req, res) =>
  alarmController.disarmSystem(req, res)
);

router.get('/status/:building_id', alarmRateLimit, verifyToken, (req, res) =>
  alarmController.getStatus(req, res)
);

module.exports = router;
