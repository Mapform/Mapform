/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["rwvej77wzlgw9uvu.public.blob.vercel-storage.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  transpilePackages: ["@mapform/ui"],
};

export default nextConfig;
