const mongoose = require("mongoose");

const SensorReadingSchema = new mongoose.Schema(
  {
    sensor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sensor",
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("SensorReading", SensorReadingSchema);