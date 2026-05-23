# @rpb/bot

Discord bot that exposes `/rpb <report-url>`. On invocation it:

1. Runs the report through `@rpb/core` (same code path as the web app).
2. Builds a snapshot of the matrix.
3. Uploads the snapshot to a **private GitHub gist** (URL never expires).
4. Replies with a link to the deployed web app loading that snapshot — anyone in the channel can open the full table without needing a WCL key.

## Required environment

| Var | What |
| --- | --- |
| `DISCORD_TOKEN` | Bot token from the Discord developer portal. |
| `DISCORD_APP_ID` | Application ID (same dev portal). |
| `ALLOWED_GUILD_IDS` | Comma-separated guild IDs to whitelist. **Leave empty to allow any guild the bot is in.** Strongly recommended to set it. |
| `WCL_API_KEY` | Your WCL v1 API key. Lives only on the bot host. |
| `WEB_BASE_URL` | Deployed web app URL, no trailing slash (e.g. `https://you.github.io/role-performance-breakdown`). |
| `GITHUB_TOKEN` | GitHub personal access token with **only** the `gist` scope. Used to host snapshots. |

## One-time Discord setup

1. https://discord.com/developers/applications → **New Application** → name it.
2. **Bot** tab → reveal the **Token** → set as `DISCORD_TOKEN`.
3. **Bot** tab → toggle **Public Bot = OFF** so nobody else can invite it.
4. **OAuth2 → URL Generator**: check `bot` and `applications.commands` scopes. Under bot permissions, just `Send Messages` and `Embed Links` are enough.
5. Copy that URL, open it in a browser, and add the bot to your server.
6. Set `ALLOWED_GUILD_IDS` to your server's id (right-click server → Copy Server ID, with Developer Mode enabled in Discord).

## One-time GitHub setup

1. https://github.com/settings/tokens → **Generate new token (classic)**.
2. Only check the **`gist`** scope. Nothing else.
3. Save as `GITHUB_TOKEN`.

## Build, register, run

```sh
npm install
npm run build --workspace=@rpb/core
npm run build --workspace=@rpb/bot

# First time, and whenever command options change:
node packages/bot/dist/register.js

# Run the bot (in production: use a process manager / systemd / fly.io / etc.).
node packages/bot/dist/index.js
```

## Use

In a channel where the bot is allowed:

```
/rpb report:https://classic.warcraftlogs.com/reports/AbCdEf...
/rpb report:AbCdEf123 mode:all no-wipes:true
```

The bot replies with a link to the web app. Click it to see the full role-performance breakdown.

## Privacy summary

- Bot is **Public=OFF** in the dev portal → only you can invite it.
- `ALLOWED_GUILD_IDS` enforces server allowlist at the message handler level → even if the invite URL leaks, commands from other servers get a polite "not enabled" reply.
- `WCL_API_KEY` and `GITHUB_TOKEN` never leave the bot's environment.
- Snapshots are uploaded as **secret/private** gists. Anyone with the gist URL can read them; gist URLs are unguessable. Treat the bot reply link like a share link — only as private as the channel it was posted in.
