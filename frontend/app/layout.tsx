import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Web3Provider } from "@/components/web3-provider";

import "./globals.css";

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "GestAgro Credit | Sepolia dApp",
  description:
    "Decentralized agricultural credit management on Sepolia testnet",
};

export const viewport: Viewport = {
  themeColor: "#2f7d3e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Web3Provider>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </Web3Provider>
      </body>
    </html>
  );
}
