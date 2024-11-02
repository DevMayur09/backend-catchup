const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    about: { type: String, default: "", max: 300 },
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

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "CatchUpSecretJwtKey", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;

  const isPassowordValid = await bcrypt.compare(password, this.password);

  return isPassowordValid;
};

module.exports = mongoose.model("User", userSchema);
