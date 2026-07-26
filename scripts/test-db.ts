import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });

async function testDb() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("Missing MONGODB_URI in .env.local");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    const dbName = mongoose.connection.name;
    const state = mongoose.connection.readyState;

    console.log("MongoDB connected");
    console.log(`Database: ${dbName}`);
    console.log(`State: ${state === 1 ? "connected" : state}`);
  } catch (error) {
    console.error("MongoDB connection failed");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

testDb();
