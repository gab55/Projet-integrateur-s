const mongoose = require('mongoose');
const Building = require('../models/Building');

class AlarmController {
  
  // ARM le système
  async armSystem(req, res) {
    try {
      const { building_id } = req.body;
      
      if (!building_id) {
        return res.status(400).json({ error: 'building_id required' });
      }
      
      const building = await Building.findOne({ building_id });
      if (!building) {
        return res.status(404).json({ error: 'Building not found' });
      }
      
      building.est_arme = true;
      building.last_armed_at = new Date();
      await building.save();
      
      return res.status(200).json({
        state: 'ARMED',
        building_id,
        message: 'System armed successfully'
      });
      
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  
  // DISARM le système
  async disarmSystem(req, res) {
    try {
      const { building_id } = req.body;
      
      if (!building_id) {
        return res.status(400).json({ error: 'building_id required' });
      }
      
      const building = await Building.findOne({ building_id });
      if (!building) {
        return res.status(404).json({ error: 'Building not found' });
      }
      
      building.est_arme = false;
      building.last_disarmed_at = new Date();
      await building.save();
      
      return res.status(200).json({
        state: 'DISARMED',
        building_id,
        message: 'System disarmed successfully'
      });
      
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  
  // Récupérer le statut
  async getStatus(req, res) {
    try {
      const { building_id } = req.params;
      
      const building = await Building.findOne({ building_id });
      if (!building) {
        return res.status(404).json({ error: 'Building not found' });
      }
      
      return res.status(200).json({
        building_id,
        est_arme: building.est_arme,
        last_armed_at: building.last_armed_at
      });
      
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AlarmController();
