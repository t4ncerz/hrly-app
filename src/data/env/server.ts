import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_PASSWORD: z.string(),
    DATABASE_USER: z.string(),
    DATABASE_NAME: z.string(),
    DATABASE_HOST: z.string(),
    CLERK_SECRET_KEY: z.string(),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    OPENAI_API_KEY: z.string(),
    GEMINI_API_KEY: z.string(),
  },
  experimental__runtimeEnv: process.env,
});
