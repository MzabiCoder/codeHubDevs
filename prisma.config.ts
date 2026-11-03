import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma 7 no longer loads .env files automatically
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // CLI (migrations) uses the direct, non-pooled Neon connection.
    // Not env(): it throws when unset, which breaks `prisma generate` on install/CI.
    url: process.env.DIRECT_URL ?? "",
  },
});
