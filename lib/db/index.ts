import "server-only";

import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as neonAuthSchema from "./neon-auth-schema";
import * as schema from "./schema";

const dbSchema = { ...schema, ...neonAuthSchema };

export type Database = NodePgDatabase<typeof dbSchema>;

const globalForDb = globalThis as unknown as { pantryPool?: Pool; pantryDb?: Database };

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * Shared database connection. Use the Neon *pooled* connection string
 * (host contains "-pooler") in DATABASE_URL when deploying to Vercel.
 */
export function getDb(): Database {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Add your Neon connection string to the environment.");
  }
  if (!globalForDb.pantryDb) {
    const url = process.env.DATABASE_URL;
    const local = /localhost|127\.0\.0\.1/.test(url);
    globalForDb.pantryPool = new Pool({
      connectionString: url,
      ssl: local ? undefined : { rejectUnauthorized: true },
      max: 5,
    });
    globalForDb.pantryDb = drizzle(globalForDb.pantryPool, { schema: dbSchema });
  }
  return globalForDb.pantryDb;
}

export { schema };
export { neonAuthUser } from "./neon-auth-schema";
