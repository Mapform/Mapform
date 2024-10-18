import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@mapform/ui/globals.css";
import { cn } from "@mapform/lib/classnames";
import Providers from "~/components/providers";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(" bg-white", inter.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
