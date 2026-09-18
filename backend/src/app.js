require("dotenv").config();


const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/auth.routes");
const sensorRoutes = require("./routes/sensor.routes");

app.use(cors());
app.use(express.json());

app.get('/',(req,res) =>{
    res.send("Test sur le serveur");
})



app.use("/api/auth", authRoutes);
app.use("/api/sensors", sensorRoutes);



module.exports = app;

