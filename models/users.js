const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First Name is required"],
      minlength: 3,
      maxlength: 60,
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "Last Name is required"],
      minlength: 3,
      maxlength: 60,
      trim: true,
    },
    email: {
      type: String,
      required: [
        true,
        "Email is required or Invalid or A User with the same email already exists",
      ],
      maxlength: 60,
      trim: true,
      lowercase: true,
      unique: true,
      validate: (value) => {
        return validator.default.isEmail(value);
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      maxlength: 60,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      maxlength: 15,
      trim: true,
    },
    user_type: {
      type: String,
      required: [true, "User type is required"],
      maxlength: 60,
      trim: true,
      enum: ["admin", "Admin", "seller", "Seller", "buyer", "Buyer"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

module.exports = mongoose.model("users", userSchema);
