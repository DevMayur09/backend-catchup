const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
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
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid Email");
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate: (value) => {
        {
          if (["male", "female", "other"].includes(value)) return true;
          else throw new Error("Invalid gender type");
        }
      },
    },
    hobbies: { type: [String] },
    photoUrl: {
      type: String,
      default: "https://images.app.goo.gl/jtf2s5N8Sxip67VcA",
      validate(value) {
        if (!validator.isURL(value)) throw new Error("Invalid URL");
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
