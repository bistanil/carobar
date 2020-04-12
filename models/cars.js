const mongoose = require("mongoose");
const validator = require("validator").default;

const carSchema = new mongoose.Schema(
  {
    carName: {
      type: String,
      required: [true, "Car name is required"],
      minlength: 3,
      maxlength: 60,
      trim: true,
    },
    userId: {
      type: String,
      required: [true, "User id is required"],
      trim: true,
    },
    chassisNo: {
      type: String,
      required: [true, "Chassis No is required"],
      trim: true,
      minlength: 3,
      maxlength: 60,
    },
    amount: {
      type: Number,
      required: [true, "Amount>=0 is required"],
      maxlength: 60,
      trim: true,
      validate: (value) => {
        return value>=0;
      }
    },
    image: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("cars", carSchema);
