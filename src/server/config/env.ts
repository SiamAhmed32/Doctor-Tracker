import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env variable: ${name}`);
  }
  return value;
}

export const env = {
  get port() {
    return Number(process.env.PORT) || 5000;
  },
  get mongoUri() {
    return required("MONGODB_URI");
  },
  get jwtSecret() {
    return required("JWT_SECRET");
  },
  get jwtExpiresIn() {
    return process.env.JWT_EXPIRES_IN || "7d";
  },
  get nodeEnv() {
    return process.env.NODE_ENV || "development";
  },
  get isProd() {
    return process.env.NODE_ENV === "production";
  },
  get clientOrigin() {
    return process.env.CLIENT_ORIGIN || "http://localhost:3000";
  },
  cookieName: "access_token",
  get appTimezone() {
    return (
      process.env.APP_TIMEZONE ||
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      "UTC"
    );
  },
};
