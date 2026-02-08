"use client";

import { useAccount } from "wagmi";
import { WalletHeader } from "@/components/wallet-header";
import { RegisterFarmerForm } from "@/components/register-farmer-form";
import { CreateCreditRequestForm } from "@/components/create-credit-request-form";
import { GetFarmerPanel } from "@/components/get-farmer-panel";
import { GetRequestPanel } from "@/components/get-request-panel";
import { LatestIdsWidget } from "@/components/latest-ids-widget";
import { Sprout } from "lucide-react";

export function GestAgroPage() {
  const { isConnected } = useAccount();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-4 pb-12 md:p-8">
      <WalletHeader />

      {!isConnected ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed bg-card py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Sprout className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-foreground">
              Connect Your Wallet
            </h2>
            <p className="text-sm text-muted-foreground">
              Connect a wallet on Sepolia to interact with the GestAgro
              contract.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Write actions */}
          <section className="flex flex-col gap-4" aria-label="Contract write actions">
            <h2 className="text-lg font-semibold text-foreground">
              Write Actions
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <RegisterFarmerForm />
              <CreateCreditRequestForm />
            </div>
          </section>

          {/* Read panels */}
          <section className="flex flex-col gap-4" aria-label="Contract read panels">
            <h2 className="text-lg font-semibold text-foreground">
              Read Data
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <GetFarmerPanel />
              <div className="flex flex-col gap-4">
                <LatestIdsWidget />
                <GetRequestPanel />
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center text-xs text-muted-foreground">
            <p>
              Contract:{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                0x0000...0000
              </code>{" "}
              on Sepolia (chain 11155111)
            </p>
          </footer>
        </>
      )}
    </main>
  );
}
