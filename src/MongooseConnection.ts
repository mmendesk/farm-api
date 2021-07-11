import * as mongoose from "mongoose";
require("dotenv/config");

export const connect = async (
  db: string = process.env.MONGO_DB_URL || "mongodb://0.0.0.0:27017"
) => {
  try {
    if (mongoose.connection.readyState !== 0) {
      return true;
    }
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });
    mongoose.connection.on("disconnected", (e) => {
      console.log("disconnected");
    });
    return true;
  } catch {
    return false;
  }
};
