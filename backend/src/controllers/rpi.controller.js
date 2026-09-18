const RPiStatus = require('../models/RPiStatus');
const Building = require('../models/Building');

class RPiController {
  // RPi envoie son état GPIO
  async updateRpiStatus(req, res) {
    try {
      const {
        building_id,
        led_red,
        led_green,
        buzzer,
        motion,
        system_armed,
        keypad_code,
        timestamp
      } = req.body;

      // Valider building_id
      if (!building_id) {
        return res.status(400).json({ error: "building_id est requis" });
      }

      // Vérifier que le building existe
      const building = await Building.findOne({ building_id });
      if (!building) {
        return res.status(404).json({
          error: "Bâtiment non trouvé",
          building_id
        });
      }

      // Créer et mettre à jour le status du RPi
      let rpiStatus = await RPiStatus.findOne({ building_id });

      if (!rpiStatus) {
        rpiStatus = new RPiStatus({
          building_id,
          led_red: led_red || false,
          led_green: led_green || false,
          buzzer: buzzer || false,
          motion: motion || false,
          system_armed: system_armed || false,
          keypad_code: keypad_code || null,
          timestamp: new Date()
        });


        console.log(`Nouveau RPiStatus est crée pour ${building_id}`)
      } else {
        // Mettre à jour les valeurs
        rpiStatus.led_red = led_red !== undefined ? led_red : rpiStatus.led_red;;
        rpiStatus.led_green = led_green !== undefined ? led_green : rpiStatus.led_green;
        rpiStatus.buzzer = buzzer !== undefined ? buzzer : rpiStatus.buzzer;
        rpiStatus.motion = motion !== undefined ? motion : rpiStatus.motion;;
        rpiStatus.system_armed = system_armed !== undefined ? system_armed : rpiStatus.system_armed;
        rpiStatus.keypad_code = keypad_code !== undefined ? keypad_code : rpiStatus.keypad_code;
        rpiStatus.timestamp = new Date();
        console.log(`RPiStatus mis à jour pour ${building_id}`);
      }

      await rpiStatus.save();
      
      return res.status(200).json({
        message: 'Status mise à jour avec succes',
        building_id,
        data: {
          led_red: rpiStatus.led_red,
          led_green: rpiStatus.led_green,
          buzzer: rpiStatus.buzzer,
          motion: rpiStatus.motion,
          system_armed: rpiStatus.system_armed,
          keypad_code: rpiStatus.keypad_code,
          timestamp: rpiStatus.timestamp
        }
      });
      
    } catch (err) {
      console.error('Erreur dans updateRpiStatus:', err);
      return res.status(500).json({ error: err.message });
    }
  }
  
  // Backend récupère l'état GPIO du RPi
  async getRpiStatus(req, res) {
    try {
      const { building_id } = req.params;

      if (!building_id) {
        return res.status(400).json({ error: 'building_id est requis' });
      }

      const rpiStatus = await RPiStatus.findOne({ building_id });

      if (!rpiStatus) {
        return res.status(404).json({
          error: "RPi status pas trouvé",
          message: "RPi n'a pas encore envoyé de status",
          building_id
        });
      }

      const now = new Date();
      const lastUpdate = new Date(rpiStatus.timestamp);
      const secondsAgo = Math.floor((now - lastUpdate) / 1000);


      return res.status(200).json({
        building_id,
        data: {
          led_red: rpiStatus.led_red,
          led_green: rpiStatus.led_green,
          buzzer: rpiStatus.buzzer,
          motion: rpiStatus.motion,
          system_armed: rpiStatus.system_armed,
          keypad_code: rpiStatus.keypad_code,
        },
        timestamp: rpiStatus.timestamp,
        last_updated_seconds_ago: secondsAgo,
        status: "OK"
      });
      
    } catch (err) {
      console.error('Ereur dans getRpiStatus:', err);
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new RPiController();