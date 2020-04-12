const mongoose = require("mongoose");

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
      required: [true, "Use id is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      maxlength: 60,
      trim: true,
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
