import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_DATABASE: z.string(),
    POSTGRES_HOST: z.string(),
    POSTGRES_URL: z.string(),
    CLERK_SECRET_KEY: z.string(),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    OPENAI_API_KEY: z.string(),
    GEMINI_API_KEY: z.string(),
  },
  experimental__runtimeEnv: process.env,
});
