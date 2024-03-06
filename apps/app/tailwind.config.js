import sharedConfig from "@floe/tailwind/tailwind.config.js";

const config = {
  presets: [sharedConfig],
  content: [
    "../../packages/ui/**/*.{ts,tsx,md,mdx}",
    "./components/**/*.{ts,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
      },
    },
  },
};

export default config;
