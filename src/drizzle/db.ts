import { env } from "@/data/env/server";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import postgres from "postgres";

const client = postgres(env.POSTGRES_URL);

export const db = drizzle({
  schema,
  client,
});
