import { env } from "@/data/env/server";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const db = drizzle({
  schema,
  connection: {
    password: env.POSTGRES_PASSWORD,
    user: env.POSTGRES_USER,
    database: env.POSTGRES_DATABASE,
    host: env.POSTGRES_HOST,
  },
});
