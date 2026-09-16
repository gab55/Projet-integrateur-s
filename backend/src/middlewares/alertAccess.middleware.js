const Alert = require('../models/Alert');
const Sensor = require('../models/Sensor');
const LocationPermission = require('../models/LocationPermissions');

async function checkAlertAccess(req, res, next) {
    try {
        const { alertId } = req.params;
        const { id: userId, role: userRole } = req.user;

        const alert = await Alert.findOne({ _id: alertId });


        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }


        if (userRole === 'ADMIN') {
            req.alert = alert;
            return next();
        }

        const sensor = await Sensor.findById(alert.sensorId);
        if (!sensor) {
            return res.status(404).json({ message: 'Sensor not found' });
        }


        const hasAccess = await LocationPermission.findOne({
            userId,
            locationId: sensor.locationId });
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
    checkAlertAccess
}