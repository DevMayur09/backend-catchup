const mongoose = require("mongoose");
const { throwError } = require("../utils/validation");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.ObjectId,
      index: true,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.ObjectId,
      index: true,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUES} is of invalid status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  const requestToSelf = connectionRequest.fromUserId.equals(connectionRequest.toUserId);
  if (requestToSelf) {
    throw new Error("You can't send connection to yourself");
  }
  next();
});

module.exports = new mongoose.model("ConnectionRequest", connectionRequestSchema);
