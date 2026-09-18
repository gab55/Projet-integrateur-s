const express = require('express');
const router = express.Router();

// Routes vides pour le moment
router.get('/', (req, res) => {
    res.json({ message: 'Alarm routes' });
});

module.exports = router;
