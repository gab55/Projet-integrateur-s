const express = require('express');
const router = express.Router();
const rpiController = require('../controllers/rpi.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/status', verifyToken, (req, res) =>
  rpiController.updateRpiStatus(req, res)
);

router.get('/status/:building_id', verifyToken, (req, res) =>
  rpiController.getRpiStatus(req, res)
);

module.exports = router;
