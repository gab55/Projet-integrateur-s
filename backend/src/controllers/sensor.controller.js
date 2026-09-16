const Sensor = require("../models/Sensor");
const SensorReading = require("../models/SensorReading");
const authService = require("../services/auth.service");
const LocationPermission = require("../models/LocationPermissions");
const Location = require("../models/Location");

async function registerSensor(req, res, next){
  let sensor = {type, model, location, armed} = req.body
  result =  await Sensor.create({sensor});
  if (!result) {
    return res.status(404).json({message: "Sensor not found"});
  }
  return res.status(201).json({result});
}

async function getSensors(req, res, next){
  try {
    const { id: userId, role: userRole } = req.user;
    let query = {};
    if (userRole !== "ADMIN") {
      const allowedPermissions = await LocationPermission.find({ userId }).lean();
      const allowedLocationIds = allowedPermissions
          .filter(p => p && p.locationId)
          .map(p => p.locationId.toString());

      query = { location: { $in: allowedLocationIds } };
    }
    const sensors = await Sensor.find(query)
        .populate('location', 'name')
        .lean()
        .exec();

    return res.status(201).json(sensors);

  } catch (err) {
    return next(err);
  }
}

async function arm(req, res, next) {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    const valid = await authService.validateNip({userId, nip: code});

    if (!valid) {
      return res.status(403).json({ message: "Invalid code" });
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

    res.json({ sensor });
  } catch (err) {
    next(err);
  }
}

async function disarm(req, res, next) {
  try {
    const { code } = req.body;
    const userId = req.user.id;
    const valid = await authService.validateNip({userId, nip: code});

    if (!valid) {
      return res.status(403).json({ message: "Invalid code" });
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

module.exports = { arm, disarm, status, addReading, getHistory, registerSensor, getSensors };