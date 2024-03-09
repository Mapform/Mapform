import sharedConfig from "@mapform/tailwind";

const config = {
  presets: [sharedConfig],
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/**/*.{ts,tsx}"],
};

export default config;
