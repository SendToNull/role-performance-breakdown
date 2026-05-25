# Role Performance Breakdown

A web-app (and Discord bot) port of the [RPB Google Sheets script](https://docs.google.com/spreadsheets/d/1EJ0g1i72rJjQkP1IN2Kz0vq31EphlrT0nCworP6ZXMc) for WoW Classic TBC WarcraftLogs reports.

## Layout

| Package | Purpose |
| --- | --- |
| `packages/core` | Pure-TS library: WCL v1 client + RPB analysis. No DOM, no Discord, no Sheets. |
| `packages/web` | Vite + React + Tailwind UI. Static. Deploys to GitHub Pages. API key lives in the user's browser only. |
| `packages/bot` | Discord bot stub. Will consume `@rpb/core` once built out. |

## API key — how it stays out of public hands

- **Web:** the WCL v1 API key is entered in the UI and stored in `localStorage` (or only in memory if you uncheck "remember"). All WCL requests go **directly from your browser** to `*.warcraftlogs.com`. The key is never sent to any other origin. A strict CSP in `index.html` enforces this at the browser level.
- **Bot:** the key lives in an env var on whatever host runs the bot (e.g. `DISCORD_BOT_TOKEN`, `WCL_API_KEY`). It is never echoed in messages or logs.
- **Never** baked into the deployed bundle. GitHub Pages serves a public bundle; do not put secrets there.
- **Privacy of the bot:** register at https://discord.com/developers, set **Public Bot = Off** in the dev portal, and only share the OAuth invite link with servers you control. Do not use a "self-bot" — Discord's ToS prohibits it.

## Dev

```sh
npm install
npm run dev          # starts the web app
npm run build        # builds all workspaces
npm run typecheck    # tsc --noEmit across packages
```

## Deploy (web → GitHub Pages)

Push to `main`; the workflow in `.github/workflows/deploy-pages.yml` builds `packages/web` and publishes the static bundle.

## Run the Discord bot

Full Discord and GitHub portal setup lives in [packages/bot/README.md](packages/bot/README.md). Once you've done that one-time setup, the bot is started from a normal shell — it has to be running for `/rpb` to work in Discord.

### One-time setup

```sh
# from the repo root
npm install
npm run build --workspace=@rpb/core
npm run build --workspace=@rpb/bot
```

Create `packages/bot/.env` (this file is gitignored — do not commit it):

```env
DISCORD_TOKEN=<bot token from the Discord dev portal>
DISCORD_APP_ID=<application id>
ALLOWED_GUILD_IDS=<your server id>      # comma-separated; leave empty to allow any guild
WCL_API_KEY=<your WCL v1 key>
WEB_BASE_URL=https://<you>.github.io/role-performance-breakdown
GITHUB_TOKEN=<PAT with only the "gist" scope>
```

### Register slash commands (first time, and after option changes)

```sh
node packages/bot/dist/register.js
```

This pushes the `/rpb` command definition to Discord. Re-run it any time `register.ts` changes.

### Start the bot

```sh
node packages/bot/dist/index.js
```

Leave the process running. You should see `Logged in as <bot-name>#<discriminator>` in the console. In Discord:

- `/rpb report:<url>` — Role Performance matrix only.
- `/cla report:<url>` — Combat Log Analytics (gear issues + consumables).
- `/full report:<url>` — both in one snapshot. The shared link opens to RPB by default with tabs to flip to Gear Issues / Consumables.

`/rpb` and `/full` also accept `mode:` (all / onlyBosses / onlyTrash) and `no-wipes:`. `/cla` ignores those — it always scans every boss fight in the report.

To keep the bot up after you close the terminal, run it under a process manager — examples:

```sh
# pm2 (https://pm2.keymetrics.io)
npm install -g pm2
pm2 start packages/bot/dist/index.js --name rpb-bot
pm2 save
pm2 startup        # follow the printed instructions to auto-start on boot

# or, plain Windows: run as a background task
start /b node packages/bot/dist/index.js
```

### Update the bot after pulling new changes

```sh
git pull
npm install                                 # only if package-lock changed
npm run build --workspace=@rpb/core
npm run build --workspace=@rpb/bot
# restart the process (e.g. `pm2 restart rpb-bot`)
```
