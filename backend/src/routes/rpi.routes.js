const express = require('express');
const router = express.Router();
const rpiController = require('../controllers/rpi.controller');

router.post('/status', (req, res) =>
  rpiController.updateRpiStatus(req, res)
);

router.get('/status/:building_id', (req, res) =>
  rpiController.getRpiStatus(req, res)
);

module.exports = router;
