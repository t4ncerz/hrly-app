import { env } from "@/data/env/server";
import { defineConfig } from "drizzle-kit";

// Determine database URL based on environment
const getDatabaseUrl = () => {
  // Use local database for development if available
  if (env.NODE_ENV === "development" && env.POSTGRES_LOCAL_URL) {
    return env.POSTGRES_LOCAL_URL;
  }

  // Use production database for production or as fallback
  return env.POSTGRES_SESSION_POOLER_URL;
};

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUrl(),
    port: 5432,
  },
});
