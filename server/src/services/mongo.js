import mongoose from "mongoose";

import "../loadEnv.js";

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", () => {
  console.error(`Error connecting to MongoDB: ${error}`);
});

export async function mongoConnect() {
  mongoose.connect(MONGO_URL);
}

export async function mongoDisconnect() {
  await mongoose.disconnect();
}
