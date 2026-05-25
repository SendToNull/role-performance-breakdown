// All env config in one place — no magic strings sprinkled through handlers.

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as dotenv from "dotenv";

// Resolve packages/bot/.env relative to this module so the bot works no
// matter the cwd it was launched from (repo root, packages/bot, etc.).
// Falls back to the cwd default if a per-package .env doesn't exist.
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageEnv = resolve(__dirname, "..", ".env");
if (existsSync(packageEnv)) {
  // `override: true` so a stale DISCORD_TOKEN from another bot in the user's
  // shell environment doesn't shadow ours.
  dotenv.config({ path: packageEnv, override: true });
} else {
  dotenv.config({ override: true });
}

export interface BotConfig {
  discordToken: string;
  discordAppId: string;
  /** Comma-separated allowlist of guild ids. Bot ignores commands from other guilds. */
  allowedGuildIds: string[];
  wclApiKey: string;
  /** Base URL of the deployed web app (e.g. https://you.github.io/role-performance-breakdown). No trailing slash. */
  webBaseUrl: string;
  /** Personal access token with `gist` scope, used to upload snapshots. */
  githubToken: string;
}

export function loadConfig(): BotConfig {
  const need = (k: string) => {
    const v = process.env[k];
    if (!v) throw new Error(`Missing required env: ${k}`);
    return v;
  };

  const allowed = (process.env["ALLOWED_GUILD_IDS"] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    discordToken: need("DISCORD_TOKEN"),
    discordAppId: need("DISCORD_APP_ID"),
    allowedGuildIds: allowed,
    wclApiKey: need("WCL_API_KEY"),
    webBaseUrl: need("WEB_BASE_URL").replace(/\/$/, ""),
    githubToken: need("GITHUB_TOKEN"),
  };
}
