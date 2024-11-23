import sharedConfig from "@mapform/ui/tailwind.config.ts";

const config = {
  presets: [sharedConfig],
  content: [
    "./next.config.mjs",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/**/*.{ts,tsx}",
    "../../packages/mapform/**/*.{ts,tsx}",
  ],
};

export default config;
