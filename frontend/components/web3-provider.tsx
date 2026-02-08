"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useRef } from "react";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi-config";

import "@rainbow-me/rainbowkit/styles.css";

// Single stable QueryClient instance outside component to prevent
// WalletConnect from being initialized multiple times on re-renders.
let queryClientSingleton: QueryClient | undefined;
function getQueryClient() {
  if (typeof window === "undefined") return new QueryClient();
  if (!queryClientSingleton) queryClientSingleton = new QueryClient();
  return queryClientSingleton;
}

function Web3ProviderInner({ children }: { children: ReactNode }) {
  const queryClient = useRef(getQueryClient()).current;

  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="en">{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// Dynamic import with SSR disabled so WalletConnect's
// indexedDB usage never runs on the server.
import dynamic from "next/dynamic";
export const Web3Provider = dynamic(
  () => Promise.resolve(Web3ProviderInner),
  { ssr: false },
);
