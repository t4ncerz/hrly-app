import { env } from "@/data/env/server";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";

const client = postgres(env.POSTGRES_SESSION_POOLER_URL);

export const db = drizzle({ schema, client });
