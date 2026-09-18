const Alert = require('../models/Alert');
const LocationPermission = require("../models/LocationPermissions");
const Sensor = require('../models/Sensor');
const mongoose = require('mongoose');


async function getHourlyMetrics(req, res, next) {
    try {
        const { id: userId, role: userRole } = req.user;
        const daysBack = parseInt(req.query.days) || 7;
        let sensorFilter = {};

        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - daysBack);


        if (userRole !== 'ADMIN') {
            const allowedPermissions = await LocationPermission
                .find({ userId }).lean();
            const allowedLocationIds = allowedPermissions
                .filter(p => p && p.locationId)
                .map((p) => p.locationId.toString());
            const allowedSensors = await Sensor
                .find({ location: { $in: allowedLocationIds } })
                .select('_id').lean();
            const allowedSensorIds = allowedSensors.map((sensor) => sensor._id);

            sensorFilter = { sensor: { $in: allowedSensorIds } };
        }

        const metrics = await Alert.aggregate([
            {
                $match: {
                    ...sensorFilter,
                    startedOn: { $gte: daysAgo }
                }
            },
            {
                $lookup: {
                    from: "sensors",
                    localField: "sensor",
                    foreignField: "_id",
                    as: "sensorDetails"
                }
            },

            { $unwind: "$sensorDetails" },

            {
                $lookup: {
                    from: "locations",
                    localField: "sensorDetails.location",
                    foreignField: "_id",
                    as: "locationDetails"
                }
            },
            { $unwind: "$locationDetails" },
            {
                $project: {
                    sensorId: "$sensor",
                    locationName: "$locationDetails.name",
                    locationId: "$locationDetails._id",
                    hour: { $hour: "$startedOn" },
                    day: { $dayOfMonth: "$startedOn" },
                    month: { $month: "$startedOn" },
                    year: { $year: "$startedOn" }
                }
            },
            {
                $group: {
                    _id: {
                        sensor: "$sensorId",
                        locationName: "$locationName",
                        locationId: "$locationId",
                        year: "$year",
                        month: "$month",
                        day: "$day",
                        hour: "$hour"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                    "_id.day": 1,
                    "_id.hour": 1
                }
            }
        ]);

        let dateRange = { start: null, end: null, days: 0 };
        if (metrics.length > 0) {
            const pad = (num) => String(num).padStart(2, '0');
            const first = metrics[0]._id;
            const last = metrics[metrics.length - 1]._id;

            dateRange.start = `${first.year}-${pad(first.month)}-${pad(first.day)}`;
            dateRange.end = `${last.year}-${pad(last.month)}-${pad(last.day)}`;

            const firstDate = new Date(dateRange.start);
            const lastDate = new Date(dateRange.end);

            dateRange.days = Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
        }


        const formatedMetrics = metrics.map(metric => {
            const pad = (num) => String(num).padStart(2, '0');
            return {
                sensorId: metric._id.sensor.toString(),
                locationId: metric._id.locationId.toString(),
                timestamp: `${metric._id.year}-${pad(metric._id.month)}-${pad(metric._id.day)} ${pad(metric._id.hour)}`,
                hourLabel: `${pad(metric._id.hour)}`,
                count: metric.count
            };
        });

        formatedMetrics.sort((a, b) => a.hourLabel.localeCompare(b.hourLabel));
        res.status(200).json({
            range: dateRange,
            data: formatedMetrics });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getHourlyMetrics
}
