import { defineConfig } from "drizzle-kit";
import { env } from "@/data/env/server";

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  dialect: "postgresql",
  strict: true,
  verbose: true,
  dbCredentials: {
    password: env.DATABASE_PASSWORD,
    user: env.DATABASE_USER,
    database: env.DATABASE_NAME,
    host: env.DATABASE_HOST,
    ssl: false,
  },
});
