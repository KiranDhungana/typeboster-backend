import path from "node:path";
import dotenv from "dotenv";

// Load `.env` from the project root (one level above `src`)
dotenv.config({
  path: path.resolve(__dirname, "..", "..", ".env"),
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

export const env = {
  PORT,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  CORS_ORIGINS: (process.env.CORS_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

