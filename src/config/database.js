const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://catchup:catchup0910@catchupcluster.kb5rx.mongodb.net/catchupDB"
  );
};

module.exports = connectDB;
