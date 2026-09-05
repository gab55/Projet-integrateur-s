// Alert.js
const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema(
  {
    classification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classification",
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "intrusion",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "RESOLVED"],
      default: "ACTIVE",
    },
    message: {
      type: String,
      required: true,
    },
    alarmOn: {
      type: Boolean,
      default: true,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

AlertSchema.methods.resolve = function (userId) {
  this.status = "RESOLVED";
  this.resolvedBy = userId;
  this.alarmOn = false;
};

module.exports = mongoose.model("Alert", AlertSchema);