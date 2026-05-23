// Discord bot entry point. Listens for /rpb, runs the report against WCL,
// uploads the snapshot as a private gist, and replies with a view-only link
// to the deployed web app.

import {
  Client,
  Events,
  GatewayIntentBits,
  MessageFlags,
  type ChatInputCommandInteraction,
} from "discord.js";
import { loadConfig, type BotConfig } from "./config.js";
import { uploadGist } from "./gist.js";
import { generateSnapshot } from "./runReportForBot.js";

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

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "rpb") return;

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

  await handleRpb(interaction, cfg);
});

async function handleRpb(
  interaction: ChatInputCommandInteraction,
  cfg: BotConfig,
) {
  const report = interaction.options.getString("report", true);
  const mode = (interaction.options.getString("mode") ?? "all") as
    | "all"
    | "onlyBosses"
    | "onlyTrash";
  const noWipes = interaction.options.getBoolean("no-wipes") ?? false;

  // Reports take a while; defer so Discord doesn't time out the interaction.
  await interaction.deferReply();

  try {
    const start = Date.now();
    const { snapshot, callsMade } = await generateSnapshot(
      {
        apiKey: cfg.wclApiKey,
        reportPathOrId: report,
        mode,
        noWipes,
      },
      (msg) => console.log(`[${snapshotPreview(report)}] ${msg}`),
    );
    const elapsedMs = Date.now() - start;

    const gist = await uploadGist(
      cfg.githubToken,
      `rpb-${snapshot.source.logId}.json`,
      JSON.stringify(snapshot),
      `RPB snapshot for ${snapshot.source.logId} · ${snapshot.source.fightCount} fights · ${snapshot.players.length} players`,
    );

    const viewUrl = `${cfg.webBaseUrl}/?snapshot=${encodeURIComponent(gist.rawUrl)}`;

    await interaction.editReply({
      content:
        `📊 **Role Performance Breakdown** — \`${snapshot.source.logId}\`\n` +
        `${snapshot.source.fightCount} fights · ${snapshot.players.length} players · ${snapshot.source.faction}\n` +
        `Filters: ${snapshot.source.filtersDesc ?? "—"}\n` +
        `Generated in ${(elapsedMs / 1000).toFixed(1)}s (${callsMade} API calls)\n\n` +
        `[Open full table](${viewUrl})`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Report failed:", err);
    await interaction.editReply({
      content: `❌ Report failed: ${msg}`,
    });
  }
}

function snapshotPreview(report: string): string {
  const m = report.match(/reports\/([A-Za-z0-9]+)/);
  return m?.[1] ?? report.slice(0, 16);
}

client.login(cfg.discordToken);
