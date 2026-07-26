import dotenv from "dotenv";
import mongoose from "mongoose";
import { UserModel } from "../src/server/features/users/user.model";
import { hashPassword } from "../src/server/shared/lib/password";

dotenv.config({ path: ".env.test" });

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for integration tests.`);
  return value;
}

function assertTestDatabase(uri: string): void {
  const databaseName = uri.split("?")[0]?.split("/").pop()?.toLowerCase();
  if (!databaseName?.includes("test")) {
    throw new Error(
      "TEST_MONGODB_URI must target a database whose name includes 'test'.",
    );
  }
}

async function prepare() {
  const uri = required("TEST_MONGODB_URI");
  assertTestDatabase(uri);
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();

  if (process.argv.includes("--setup")) {
    const email = required("TEST_ADMIN_EMAIL");
    const password = required("TEST_ADMIN_PASSWORD");
    await UserModel.create({
      name: process.env.TEST_ADMIN_NAME || "Test Admin",
      email,
      password: await hashPassword(password),
      role: "admin",
    });
  }

  await mongoose.disconnect();
}

prepare().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
