import { defineConfig } from "drizzle-kit";
import { env } from "@/data/env/server";

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL_NON_POOLING,
  },
});
