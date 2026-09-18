const express = require('express');
const router = express.Router();

const alarmController = require('../controllers/alarm.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const rateLimitByIp = new Map();
const alarmRateLimit = (req, res, next) => {
  const now = Date.now();
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const current = rateLimitByIp.get(ip);
  if (!current || now - current.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitByIp.set(ip, { count: 1, windowStart: now });
    return next();
  }
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({ message: 'Too many requests, please try again later.' });
  }
  current.count += 1;
  return next();
};

module.exports = router;
