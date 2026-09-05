// Classification.js
const mongoose = require("mongoose");

const ClassificationSchema = new mongoose.Schema(
  {
    readings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SensorReading",
        required: true,
      },
    ],
    isIntrusion: {
      type: Boolean,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
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

module.exports = mongoose.model("Classification", ClassificationSchema);