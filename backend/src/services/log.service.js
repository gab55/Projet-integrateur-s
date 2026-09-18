const Log = require("../models/Log");

async function logAction(level, message, userId = null) {
  try {
    await Log.create({ level, message, user: userId });
  } catch (err) {
    console.error("Logging failed:", err.message);
  }
}

module.exports = { logAction };