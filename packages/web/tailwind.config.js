/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // WoW class colors — used for player chips.
        wow: {
          deathknight: "#C41E3A",
          druid: "#FF7C0A",
          hunter: "#AAD372",
          mage: "#3FC7EB",
          paladin: "#F48CBA",
          priest: "#FFFFFF",
          rogue: "#FFF468",
          shaman: "#0070DD",
          warlock: "#8788EE",
          warrior: "#C69B6D",
        },
      },
    },
  },
  plugins: [],
};
