const express = require('express');
const router = express.Router();
const alarmController = require('../controllers/alarm.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/arm', verifyToken, (req, res) => 
  alarmController.armSystem(req, res)
);

router.post('/disarm', verifyToken, (req, res) =>
  alarmController.disarmSystem(req, res)
);

router.get('/status/:building_id', verifyToken, (req, res) =>
  alarmController.getStatus(req, res)
);

module.exports = router;
