require("dotenv").config();


const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/auth.routes");
const sensorRoutes = require("./routes/sensor.routes");
const logRoutes = require("./routes/log.routes");
const { logAction } = require("./services/log.service");


const alertRoutes = require("./routes/alert.routes");
const metricsRoutes = require("./routes/metrics.routes");

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

// app.get('/',(req,res) =>{
//     res.send("Test sur le serveur");
// })



app.use("/api/auth", authRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/metrics", metricsRoutes)

app.use((err, req, res, next) => {
  logAction("ERROR", err.message);
  console.error(err.message);
  res.status(400).json({ message: err.message });
});



module.exports = app;

