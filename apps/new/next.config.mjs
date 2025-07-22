import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["rwvej77wzlgw9uvu.public.blob.vercel-storage.com", "commons.wikimedia.org"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    viewTransition: true,
  },
  transpilePackages: ["@mapform/ui"],
};

export default withNextVideo(nextConfig, {
  provider: "vercel-blob",
});