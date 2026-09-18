const mongoose = require('mongoose');

class RpiController {
  
  async updateRpiStatus(req, res) {
    try {
      const { building_id, led_red, motion, system_armed, buzzer, keypad_code } = req.body;
      
      console.log(`RPi Status received: building_id=${building_id}, motion=${motion}, led_red=${led_red}, system_armed=${system_armed}, buzzer=${buzzer}`);
      
      const rpiStatus = await mongoose.connection.db.collection('rpistatuses').updateOne(
        { building_id: building_id },
        {
          $set: {
            building_id: building_id,
            led_red: led_red,
            led_green: false,
            motion: motion,
            system_armed: system_armed,
            buzzer: buzzer,
            keypad_code: keypad_code,
            timestamp: new Date()
          }
        },
        { upsert: true }
      );
      
      return res.status(200).json({
        success: true,
        message: 'Status sauvegardé',
        data: {
          building_id, led_red, motion, system_armed, buzzer
        }
      });
      
    } catch (err) {
      console.error('Erreur updateRpiStatus:', err);
      return res.status(500).json({ error: err.message });
    }
  }
  
  async getRpiStatus(req, res) {
    try {
      const { building_id } = req.params;
      
      const status = await mongoose.connection.db.collection('rpistatuses').findOne({ building_id });
      
      return res.status(200).json({
        building_id,
        data: status || {}
      });
      
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new RpiController();
