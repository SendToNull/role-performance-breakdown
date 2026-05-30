import { describe, expect, it } from "vitest";
import { parseReportInput } from "./parseReportInput.js";

const ID = "xKcBbyJh48Qk7HtV";

describe("parseReportInput", () => {
  describe("strips URL tails to bare id", () => {
    it.each([
      [`https://classic.warcraftlogs.com/reports/${ID}`, ID],
      [`https://classic.warcraftlogs.com/reports/${ID}/`, ID],
      [`https://classic.warcraftlogs.com/reports/${ID}?fight=1`, ID],
      [
        `https://classic.warcraftlogs.com/reports/${ID}?type=damage-done&translate=true&boss=-3&difficulty=0`,
        ID,
      ],
      [
        `https://classic.warcraftlogs.com/reports/${ID}?type=damage-done&translate=true&boss=-3&difficulty=0&options=512`,
        ID,
      ],
      [
        `https://classic.warcraftlogs.com/reports/${ID}#fight=1&type=damage-done`,
        ID,
      ],
      [`https://classic.warcraftlogs.com/reports/${ID}/?fight=1`, ID],
      [`https://classic.warcraftlogs.com/reports/${ID}/#fight=1`, ID],
    ])("%s -> %s", (input, expected) => {
      expect(parseReportInput(input).logId).toBe(expected);
    });
  });

  describe("accepts alternate hosts", () => {
    it.each([
      `https://tbc.warcraftlogs.com/reports/${ID}`,
      `https://fresh.warcraftlogs.com/reports/${ID}?boss=-3`,
      `https://warcraftlogs.com/reports/${ID}`,
    ])("%s", (input) => {
      expect(parseReportInput(input).logId).toBe(ID);
    });
  });

  describe("accepts bare ids (with or without tail junk)", () => {
    it.each([
      [ID, ID],
      [`${ID}/`, ID],
      [`${ID}?fight=1`, ID],
      [`${ID}#fight=1`, ID],
    ])("%s -> %s", (input, expected) => {
      expect(parseReportInput(input).logId).toBe(expected);
    });
  });

  describe("normalization", () => {
    it("trims surrounding whitespace", () => {
      expect(parseReportInput(`  ${ID}  `).logId).toBe(ID);
    });
    it("rewrites .cn host to .com (per source RPB.gs:87)", () => {
      const input = `https://classic.warcraftlogs.cn/reports/${ID}`;
      expect(parseReportInput(input).logId).toBe(ID);
    });
  });

  describe("vanilla flag", () => {
    it("flags vanilla report URLs", () => {
      const parsed = parseReportInput(
        `https://vanilla.warcraftlogs.com/reports/${ID}`,
      );
      expect(parsed.isVanilla).toBe(true);
    });
    it("does not flag classic / tbc / fresh", () => {
      expect(
        parseReportInput(`https://classic.warcraftlogs.com/reports/${ID}`)
          .isVanilla,
      ).toBe(false);
    });
  });
});
