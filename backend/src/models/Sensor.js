const mongoose = require("mongoose");

const SensorSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      default: "ultrasonic",
    },
    model: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
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

SensorSchema.methods.checkActive = function () {
  return true; 
};

module.exports = mongoose.model("Sensor", SensorSchema);