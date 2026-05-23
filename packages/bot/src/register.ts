// One-time slash-command registration. Run once after deploying the bot
// (and again whenever command options change).
//
//   node packages/bot/dist/register.js
//
// Registers globally if ALLOWED_GUILD_IDS is empty, otherwise per guild for
// faster propagation.

import {
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import { loadConfig } from "./config.js";

const command = new SlashCommandBuilder()
  .setName("rpb")
  .setDescription("Generate a Role Performance Breakdown for a WCL report")
  .addStringOption((o) =>
    o
      .setName("report")
      .setDescription("WCL report URL or id")
      .setRequired(true),
  )
  .addStringOption((o) =>
    o
      .setName("mode")
      .setDescription("Which fights to include")
      .setRequired(false)
      .addChoices(
        { name: "Bosses only (default)", value: "onlyBosses" },
        { name: "All fights", value: "all" },
        { name: "Trash only", value: "onlyTrash" },
      ),
  )
  .addBooleanOption((o) =>
    o
      .setName("no-wipes")
      .setDescription("Exclude wipes")
      .setRequired(false),
  );

async function main() {
  const cfg = loadConfig();
  const rest = new REST({ version: "10" }).setToken(cfg.discordToken);
  const body = [command.toJSON()];

  if (cfg.allowedGuildIds.length > 0) {
    for (const guildId of cfg.allowedGuildIds) {
      await rest.put(
        Routes.applicationGuildCommands(cfg.discordAppId, guildId),
        { body },
      );
      console.log(`Registered /rpb in guild ${guildId}`);
    }
  } else {
    await rest.put(Routes.applicationCommands(cfg.discordAppId), { body });
    console.log("Registered /rpb globally (may take up to 1h to propagate)");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
