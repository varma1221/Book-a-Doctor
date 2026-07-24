const mongoose = require("mongoose");

const connectToDB = async () => {
  const connUri = process.env.MONGO_URI || process.env.MONGO_DB || "mongodb://127.0.0.1:27017/book-a-doctor";
  try {
    await mongoose.connect(connUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000
    });
    console.log("MongoDB database connected successfully");
  } catch (error) {
    console.log("Local MongoDB server not running. Launching in-memory MongoDB database...");
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log("In-memory MongoDB database connected successfully");
    } catch (memError) {
      console.error(`Database connection error: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectToDB;
