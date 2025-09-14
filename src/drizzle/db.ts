import { env } from "@/data/env/server";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";

// Determine database URL based on environment
const getDatabaseUrl = () => {
  // Use local database for development if available
  if (env.NODE_ENV === "development" && env.POSTGRES_LOCAL_URL) {
    console.log("🔧 Using local database for development");
    return env.POSTGRES_LOCAL_URL;
  }

  // Use production database for production or as fallback
  console.log("🌐 Using production database");
  return env.POSTGRES_SESSION_POOLER_URL;
};

const client = postgres(getDatabaseUrl());

export const db = drizzle({ schema, client });
