/**
 * Neon Auth / Better Auth tables in the `neon_auth` schema.
 * Managed by Neon Auth — the app only reads these rows for authorization.
 */
import { boolean, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

export const neonAuth = pgSchema("neon_auth");

export const neonAuthUser = neonAuth.table("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  emailVerified: boolean("emailVerified"),
  image: text("image"),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }),
  updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("banReason"),
  banExpires: timestamp("banExpires", { withTimezone: true, mode: "string" }),
});
