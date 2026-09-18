const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({

  building_id: { type: String, unique: true },

  name: String,

  est_arme: { type: Boolean, default: false },

  last_armed_at: Date,

  last_disarmed_at: Date,

  armed_by: String,

  disarmed_by: String
  
});