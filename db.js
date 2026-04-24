const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;