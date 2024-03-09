import sharedConfig from "@mapform/ui/tailwind.config.ts";

const config = {
  presets: [sharedConfig],
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/**/*.{ts,tsx}"],
};

export default config;
