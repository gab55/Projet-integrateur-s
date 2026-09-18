const Alert = require("../models/Alert");
const Sensor = require("../models/Sensor");
const authService = require("../services/auth.service");
const LocationPermission = require("../models/LocationPermissions");
const Location = require("../models/Location");

async function newAlert(req, res, next){
    try {
        const sensor = await Sensor.findById(req.params.id);
        if (!sensor) {
            return res.status(404).json({ message: "Sensor not found" });
        }
        const alert = await Alert.create({
            classification: req.body.classification,
            type: req.body.type,
            message: req.body.message,
        });
        res.status(201).json({ alert });
    } catch (err) {
        next(err);
    }
}

async function getAlerts(req, res, next){
    try {
        const { id: userId, role: userRole } = req.user;
        let alertQuery = {};

        if (userRole !== "ADMIN") {
            const allowedPermissions = await LocationPermission.find({ userId }).lean();
            const allowedLocationIds = allowedPermissions
                .filter(p => p && p.locationId)
                .map(p => p.locationId.toString());

            const allowedSensors = await Sensor.find({ location: { $in: allowedLocationIds } }).select('_id').lean();
            const allowedSensorIds = allowedSensors.map(s => s._id);

            alertQuery = { sensor: { $in: allowedSensorIds } };
        }


        const alertsHistory = await Alert.find(alertQuery)
            .sort({ alarmOn: -1, startedOn: -1 })
            .limit(50)
            .populate('resolvedBy', 'firstName name email')
            .populate({
                path: 'sensor',
                select: 'name model locationId type',
                populate: {
                    path: 'location',
                    model: 'Location',
                    select: 'name'
                }
            })
            .lean()
            .exec();


        return res.status(201).json(alertsHistory);

    } catch (err) {
        return next(err);
    }
}

async function getOneAlert(req, res, next){
    let result;
    try {
        result = await Alert
            .findById(req.params.id)
            .populate('resolvedBy')
            .lean()
            .exec();
        return res.status(201).json(result);
    } catch (err) {
        return next(err);
    }
}


async function resolveAlert(req, res, next) {
    try {
        const code = req.body.code;
        const userId = req.user.id;

        const valid = await authService.validateNip({userId, nip: code});

        if (!valid) {
            console.error("Invalid code");
            return res.status(403).json({ message: "Invalid code" });
        }

        const alertId = req.params.alertId || req.params.id;
        const alert = await Alert.findById(alertId);
        if (!alert) {
            console.error("Alert not found");
            return res.status(404).json({ message: "Alert not found" });
        }

        if (alert.status === "RESOLVED") {
            return res.status(409).json({ message: "Alert is already resolved" });
        }

        const updatedAlert = await Alert.findByIdAndUpdate(
            req.params.id,
            {
                status: "RESOLVED",
                resolvedBy: req.user.id,
                alarmOn: false,
                resolvedAt: new Date(),

            },
            { new: true }
        );

        res.json({ alert: updatedAlert });

    } catch (err) {
        next(err);
    }
}

async function alertStatus(req, res, next) {
    try {
        const alert = await Alert.findById(req.params.id);
        if (!alert) {
            return res.status(404).json({ message: "Alert not found" });
        }
        res.json({ status: alert.status });
    } catch (err) {
        next(err);
    }
}





module.exports = { newAlert, getAlerts, getOneAlert, resolveAlert, alertStatus };
