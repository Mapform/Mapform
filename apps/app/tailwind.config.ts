import type { Config } from "tailwindcss";
import sharedConfig from "@mapform/ui/tailwind.config.ts";

const config: Partial<Config> = {
  presets: [sharedConfig],
  darkMode: ["class"],
  content: [
    "./next.config.mjs",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/**/*.{ts,tsx}",
    "../../packages/mapform/**/*.{ts,tsx}",
  ],
};

export default config;
