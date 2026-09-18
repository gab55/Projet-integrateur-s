require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("MongoDB connecté");
})
.catch(err => {
  console.error("Erreur MongoDB:", err);
  process.exit(1);
});

app.get('/', (req, res) => {
    res.send("Test sur le serveur");
});

const sensorRoutes = require("./routes/sensor.routes");
const alarmRoutes = require('./routes/alarm.routes');
const rpiRoutes = require('./routes/rpi.routes');

app.use("/api/sensors", sensorRoutes);
app.use('/api/alarm', alarmRoutes);
app.use('/api/rpi', rpiRoutes);

module.exports = app;