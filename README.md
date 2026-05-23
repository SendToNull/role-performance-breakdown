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
