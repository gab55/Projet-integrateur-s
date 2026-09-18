require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/auth.routes");
const sensorRoutes = require("./routes/sensor.routes");
const logRoutes = require("./routes/log.routes");
const alertRoutes = require("./routes/alert.routes");
const metricsRoutes = require("./routes/metrics.routes");
const permissionsRoutes = require("./routes/permissions.routes");
const alarmRoutes = require("./routes/alarm.routes");
const rpiRoutes = require("./routes/rpi.routes");


const { logAction } = require("./services/log.service");


app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/logs", logRoutes);

app.use("/api/metrics", metricsRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/permissions", permissionsRoutes);

app.use("/api/alerts", alertRoutes);
app.use('/api/alarm', alarmRoutes);

app.use('/api/rpi', rpiRoutes);

app.use((err, req, res, next) => {
    logAction("ERROR", err.message);
    console.error(err.message);
    res.status(400).json({ message: err.message });
});

module.exports = app;
