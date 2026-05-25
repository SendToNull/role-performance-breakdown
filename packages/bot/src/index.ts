// Discord bot entry point. Listens for /rpb, /cla, /full, runs the requested
// section(s) against WCL, uploads a bundle snapshot as a private gist, and
// replies with a view-only link to the deployed web app.

import {
  Client,
  Events,
  GatewayIntentBits,
  MessageFlags,
  type ChatInputCommandInteraction,
} from "discord.js";
import { loadConfig, type BotConfig } from "./config.js";
import { uploadGist } from "./gist.js";
import { generateBundle } from "./runReportForBot.js";

const cfg = loadConfig();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
  if (cfg.allowedGuildIds.length > 0) {
    console.log(`Allowlist: ${cfg.allowedGuildIds.join(", ")}`);
  } else {
    console.log("Allowlist: (any guild) — set ALLOWED_GUILD_IDS to restrict");
  }
});

const HANDLED_COMMANDS = new Set(["rpb", "cla", "full"]);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (!HANDLED_COMMANDS.has(interaction.commandName)) return;

  // Guild allowlist enforcement. Even if someone manages to invite the bot to
  // a guild not on the list, this rejects their commands.
  if (
    cfg.allowedGuildIds.length > 0 &&
    (!interaction.guildId || !cfg.allowedGuildIds.includes(interaction.guildId))
  ) {
    await interaction.reply({
      content: "This bot is private and isn't enabled for this server.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await handleCommand(interaction, cfg);
});

async function handleCommand(
  interaction: ChatInputCommandInteraction,
  cfg: BotConfig,
) {
  const cmd = interaction.commandName as "rpb" | "cla" | "full";
  const report = interaction.options.getString("report", true);
  const includeRpb = cmd === "rpb" || cmd === "full";
  const includeCla = cmd === "cla" || cmd === "full";
  // RPB-only options (Discord rejects unknown options, so these are only
  // declared on /rpb and /full; safely ignored on /cla).
  const mode = includeRpb
    ? ((interaction.options.getString("mode") ?? "all") as
        | "all"
        | "onlyBosses"
        | "onlyTrash")
    : undefined;
  const noWipes = includeRpb
    ? (interaction.options.getBoolean("no-wipes") ?? false)
    : undefined;

  await interaction.deferReply();

  try {
    const start = Date.now();
    const { bundle, callsMade, summary } = await generateBundle(
      {
        apiKey: cfg.wclApiKey,
        reportPathOrId: report,
        includeRpb,
        includeCla,
        ...(mode !== undefined ? { mode } : {}),
        ...(noWipes !== undefined ? { noWipes } : {}),
      },
      (msg) => console.log(`[${cmd} ${snapshotPreview(report)}] ${msg}`),
    );
    const elapsedMs = Date.now() - start;

    const gist = await uploadGist(
      cfg.githubToken,
      `${cmd}-${summary.logId}.json`,
      JSON.stringify(bundle),
      `${cmd.toUpperCase()} snapshot for ${summary.logId} · ${summary.playerCount} players`,
    );

    const viewUrl = `${cfg.webBaseUrl}/?snapshot=${encodeURIComponent(gist.rawUrl)}`;

    const titleLine =
      cmd === "rpb" ? "📊 **Role Performance Breakdown**"
      : cmd === "cla" ? "🧪 **Combat Log Analytics**"
      : "📊🧪 **RPB + CLA (combined)**";

    const detailLines: string[] = [];
    if (summary.fightCount !== undefined) {
      detailLines.push(`${summary.fightCount} fights`);
    }
    if (summary.bossesScanned !== undefined) {
      detailLines.push(`${summary.bossesScanned} bosses scanned`);
    }
    detailLines.push(`${summary.playerCount} players`);

    await interaction.editReply({
      content:
        `${titleLine} — \`${summary.logId}\`\n` +
        `${detailLines.join(" · ")}\n` +
        (bundle.source.filtersDesc ? `Filters: ${bundle.source.filtersDesc}\n` : "") +
        `Generated in ${(elapsedMs / 1000).toFixed(1)}s (${callsMade} API calls)\n\n` +
        `[Open shared view](${viewUrl})`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`/${cmd} failed:`, err);
    await interaction.editReply({
      content: `❌ /${cmd} failed: ${msg}`,
    });
  }
}

function snapshotPreview(report: string): string {
  const m = report.match(/reports\/([A-Za-z0-9]+)/);
  return m?.[1] ?? report.slice(0, 16);
}

client.login(cfg.discordToken);
