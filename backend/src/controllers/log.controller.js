const Log = require("../models/Log");

async function getLogs(req, res, next) {
  try {
    const logs = await Log.find().sort({ createdAt: -1 }).limit(100);
    res.json({ logs });
  } catch (err) {
    next(err);
  }
}

module.exports = { getLogs };