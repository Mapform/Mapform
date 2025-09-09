import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@mapform/ui/globals.css";
import "@mapform/blocknote/blocknote.css";
import { cn } from "@mapform/lib/classnames";
import { Toaster } from "@mapform/ui/components/toaster";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { RootProviders } from "./root-providers";
import { defaultMetadata, defaultViewport } from "./metadata";
import { getCurrentSession } from "~/data/auth/get-current-session";
import { MobileWarning } from "../components/mobile-warning";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  ...defaultMetadata,
};

export const viewport: Viewport = {
  ...defaultViewport,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentSessionPromise = getCurrentSession();

  return (
    // Need suppressHydrationWarning to support next-theme (as per docs)
    <html lang="en" suppressHydrationWarning>
      <body className={cn("h-full bg-white", inter.className)}>
        <RootProviders currentSessionPromise={currentSessionPromise}>
          <MobileWarning />
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </RootProviders>
      </body>
    </html>
  );
}
