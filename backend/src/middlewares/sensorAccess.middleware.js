const Sensor = require('../models/Sensor');
const LocationPermission = require('../models/LocationPermissions');

async function checkSensorAccess(req, res, next) {
    try {
        const sensorId = req.params.sensorId || req.params.id;
        const { id: userId, role: userRole } = req.user;

        const sensor = await Sensor.findById(sensorId);
        if (!sensor) {
            return res.status(404).json({ message: 'Sensor not found' });
        }
        if (userRole === 'ADMIN') {
            req.sensor = sensor;
            return next();
        }
        const hasAccess = await LocationPermission.findOne({
            userId,
            locationId: sensor.location });
        if (!hasAccess) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = {
    checkSensorAccess
}