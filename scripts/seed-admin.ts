import dotenv from "dotenv";
import mongoose from "mongoose";
import { hashPassword } from "../src/server/shared/lib/password";
import { UserModel } from "../src/server/features/users/user.model";

dotenv.config({ path: ".env.local" });

async function seedAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME || "Admin";

  if (!email || !password) {
    throw new Error(
      "SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required in .env.local",
    );
  }

  await mongoose.connect(uri);

  const existing = await UserModel.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    await mongoose.disconnect();
    return;
  }

  await UserModel.create({
    name,
    email,
    password: await hashPassword(password),
    role: "admin",
  });

  console.log(`Admin seeded for ${email}`);
  console.log("Password was taken from SEED_ADMIN_PASSWORD (not printed).");
  await mongoose.disconnect();
}

seedAdmin().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
