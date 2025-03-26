import { defineConfig } from "drizzle-kit";
import { env } from "@/data/env/server";

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  dialect: "postgresql",
  strict: true,
  verbose: true,
  dbCredentials: {
    password: env.POSTGRES_PASSWORD,
    user: env.POSTGRES_USER,
    database: env.POSTGRES_DATABASE,
    host: env.POSTGRES_HOST,
    ssl: false,
  },
});
