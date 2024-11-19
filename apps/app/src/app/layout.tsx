import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@mapform/ui/globals.css";
import { cn } from "@mapform/lib/classnames";
import { Toaster } from "@mapform/ui/components/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { RootProviders } from "~/components/root-providers";
import { defaultMetadata } from "./metadata";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  ...defaultMetadata,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Need suppressHydrationWarning to support next-theme (as per docs)
    <html lang="en" suppressHydrationWarning>
      <body className={cn("h-full bg-white", inter.className)}>
        <RootProviders>
          {children}
          <SpeedInsights />
          <Toaster />
        </RootProviders>
      </body>
    </html>
  );
}
