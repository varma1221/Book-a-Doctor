const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || process.env.MONGO_DB || "mongodb://localhost:27017/book-a-doctor";
    await mongoose.connect(connUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB database connected successfully");
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectToDB;
