const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      unique: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Use `minlength` for Mongoose validation
      maxlength: 16, // Use `maxlength` for Mongoose validation
      validate: {
        validator: function (value) {
          const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/; // Added max length check in regex
          return regex.test(value);
        },
        message:
          "Invalid password! Password must be 8-16 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate: {
        validator: function (value) {
          if (["male", "female", "other"].includes(value)) return true;
        },
        message: "Invalid gender.",
      },
    },
    hobbies: { type: [String] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
