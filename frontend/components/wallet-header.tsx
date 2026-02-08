"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId } from "wagmi";
import { Badge } from "@/components/ui/badge";
import { Sprout, AlertTriangle, CheckCircle2 } from "lucide-react";

const SEPOLIA_CHAIN_ID = 11155111;

export function WalletHeader() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;

  return (
    <header className="flex flex-col gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sprout className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            GestAgro Credit
          </h1>
          <p className="text-sm text-muted-foreground">
            Decentralized agricultural credit on Sepolia
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isConnected && (
          <Badge
            variant={isCorrectNetwork ? "default" : "destructive"}
            className="flex items-center gap-1.5 px-3 py-1"
          >
            {isCorrectNetwork ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Sepolia
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3" />
                Wrong Network
              </>
            )}
          </Badge>
        )}
        <ConnectButton showBalance={false} />
      </div>
    </header>
  );
}
