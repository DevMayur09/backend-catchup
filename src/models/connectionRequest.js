const mongoose = require("mongoose");
const { throwError } = require("../utils/validation");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
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

//Compound index so query with find becomes very fast....

ConnectionRequestSchema.index({ fromUserId: 1 }, { toUserId: 1 });

ConnectionRequestSchema.pre("save", function (next) {
  const ConnectionRequest = this;
  const requestToSelf = ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId);
  if (requestToSelf) {
    throw new Error("You can't send connection request to yourself");
  }
  next();
});

module.exports = new mongoose.model("ConnectionRequest", ConnectionRequestSchema);
