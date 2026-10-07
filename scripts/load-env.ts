/**
 * Load `.env*` the same way `next dev` does (CLI scripts don't otherwise).
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
