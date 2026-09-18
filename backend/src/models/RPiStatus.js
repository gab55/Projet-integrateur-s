const mongoose = require('mongoose');

const rpiStatusSchema = new mongoose.Schema({
  building_id: { type: String, required: true, unique: true },
  
  // État GPIO
  led_red: { type: Boolean, default: false },
  led_green: { type: Boolean, default: false },
  buzzer: { type: Boolean, default: false },
  motion: { type: Boolean, default: false },
  system_armed: { type: Boolean, default: false },
  keypad_code: { type: String, default: null },
  
  // Horodatage
  timestamp: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now }
});

rpiStatusSchema.index({ building_id: 1 });
rpiStatusSchema.index({ timestamp: -1 });

module.exports = mongoose.model('RPiStatus', rpiStatusSchema);