const Sensor = require("../models/Sensor");
const SensorReading = require("../models/SensorReading");

async function arm(req, res, next) {
  try {
    const { code } = req.body;

    if (code !== process.env.ARM_CODE) {
      return res.status(401).json({ message: "Invalid code" });
    }

    const sensor = await Sensor.findById(req.params.id);
    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }

    if (sensor.armed) {
      return res.status(409).json({ message: "Sensor is already armed" });
    }

    sensor.armed = true;
    await sensor.save();

    console.log(`[${new Date().toISOString()}] Sensor ${sensor.id} armed`);

    res.json({ sensor });
  } catch (err) {
    next(err);
  }
}

async function disarm(req, res, next) {
  try {
    const { code } = req.body;

    if (code !== process.env.ARM_CODE) {
      return res.status(401).json({ message: "Invalid code" });
    }

    const sensor = await Sensor.findById(req.params.id);
    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }

    if (!sensor.armed) {
      return res.status(409).json({ message: "Sensor is already disarmed" });
    }

    sensor.armed = false;
    await sensor.save();

    console.log(`[${new Date().toISOString()}] Sensor ${sensor.id} disarmed`);

    res.json({ sensor });
  } catch (err) {
    next(err);
  }
}

async function status(req, res, next) {
  try {
    const sensor = await Sensor.findById(req.params.id);
    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }
    res.json({ armed: sensor.armed });
  } catch (err) {
    next(err);
  }
}

async function addReading(req, res, next) {
  try {
    const sensor = await Sensor.findById(req.params.id);
    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }

    const reading = await SensorReading.create({
      sensor: sensor.id,
      value: req.body.value,
    });

    res.status(201).json({ reading });
  } catch (err) {
    next(err);
  }
}

async function getHistory(req, res, next) {
  try {
    const sensor = await Sensor.findById(req.params.id);
    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }

    const readings = await SensorReading.find({ sensor: sensor.id })
      .sort({ recordedAt: -1 })
      .limit(50);

    res.json({ readings });
  } catch (err) {
    next(err);
  }
}

module.exports = { arm, disarm, status, addReading, getHistory };

