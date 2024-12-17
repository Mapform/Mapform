import type { Config } from "tailwindcss";
import sharedConfig from "@mapform/ui/tailwind.config.ts";

const config: Partial<Config> = {
  presets: [sharedConfig],
};

export default config;
