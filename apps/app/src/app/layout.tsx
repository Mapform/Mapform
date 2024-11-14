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
    <html lang="en">
      <body
        className={cn(
          "h-screen w-screen overflow-hidden bg-white",
          inter.className,
        )}
      >
        <RootProviders>
          <div className="flex h-full flex-col overflow-hidden">{children}</div>
          <SpeedInsights />
          <Toaster />
        </RootProviders>
      </body>
    </html>
  );
}
