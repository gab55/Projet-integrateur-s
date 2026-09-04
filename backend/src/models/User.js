const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name:{
            type :String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 80,
        },
        firstName:{
            type :String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 80,
        },
        role:{
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email"],
        },
        passwordHash:{
            type: String,
            required: true,
            select: false,
        }
    },
      {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("User", UserSchema);