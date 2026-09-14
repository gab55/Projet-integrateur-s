const Alert = require("../models/Alert");
const Sensor = require("../models/Sensor");
const authService = require("../services/auth.service");
const Users = require("../models/User");

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
    let result;
    try {
        result = await Alert
            .find()
            .sort({ alarmOn: -1, startedOn: -1 })
            .populate('resolvedBy')
            .lean()
            .exec();

        return res.status(201).json(result);
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
        const { code } = req.body;
        const userId = req.user.id;
        const valid = await authService.validateNip({userId, nip: code});

        if (!valid) {
            return res.status(403).json({ message: "Invalid code" });
        }

        const alert = await Alert.findById(req.params.id);
        if (!alert) {
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
