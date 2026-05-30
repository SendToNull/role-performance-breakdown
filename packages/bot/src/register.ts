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

const rpb = new SlashCommandBuilder()
  .setName("rpb")
  .setDescription("Role Performance Breakdown for a WCL report")
  .addStringOption((o) =>
    o.setName("report").setDescription("WCL report URL or id").setRequired(true),
  )
  .addStringOption((o) =>
    o
      .setName("mode")
      .setDescription("Which fights to include")
      .setRequired(false)
      .addChoices(
        { name: "All fights (default)", value: "all" },
        { name: "Bosses only", value: "onlyBosses" },
        { name: "Trash only", value: "onlyTrash" },
      ),
  )
  .addBooleanOption((o) =>
    o.setName("no-wipes").setDescription("Exclude wipes").setRequired(false),
  );

const cla = new SlashCommandBuilder()
  .setName("cla")
  .setDescription("Combat Log Analytics (gear issues + consumables)")
  .addStringOption((o) =>
    o.setName("report").setDescription("WCL report URL or id").setRequired(true),
  )
  .addBooleanOption((o) =>
    o
      .setName("mother-shahraz")
      .setDescription(
        "Surface enchant flags that only appear on Mother Shahraz (off by default)",
      )
      .setRequired(false),
  );

const full = new SlashCommandBuilder()
  .setName("full")
  .setDescription("Run RPB + CLA together and share a single link")
  .addStringOption((o) =>
    o.setName("report").setDescription("WCL report URL or id").setRequired(true),
  )
  .addStringOption((o) =>
    o
      .setName("mode")
      .setDescription("Which fights to include in the RPB section")
      .setRequired(false)
      .addChoices(
        { name: "All fights (default)", value: "all" },
        { name: "Bosses only", value: "onlyBosses" },
        { name: "Trash only", value: "onlyTrash" },
      ),
  )
  .addBooleanOption((o) =>
    o.setName("no-wipes").setDescription("Exclude wipes (RPB only)").setRequired(false),
  )
  .addBooleanOption((o) =>
    o
      .setName("mother-shahraz")
      .setDescription(
        "Surface CLA enchant flags that only appear on Mother Shahraz (off by default)",
      )
      .setRequired(false),
  );

async function main() {
  const cfg = loadConfig();
  const rest = new REST({ version: "10" }).setToken(cfg.discordToken);
  const body = [rpb.toJSON(), cla.toJSON(), full.toJSON()];

  if (cfg.allowedGuildIds.length > 0) {
    for (const guildId of cfg.allowedGuildIds) {
      await rest.put(
        Routes.applicationGuildCommands(cfg.discordAppId, guildId),
        { body },
      );
      console.log(`Registered /rpb, /cla, /full in guild ${guildId}`);
    }
  } else {
    await rest.put(Routes.applicationCommands(cfg.discordAppId), { body });
    console.log(
      "Registered /rpb, /cla, /full globally (may take up to 1h to propagate)",
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
