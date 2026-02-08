"use client";

import React from "react"

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GESTAGRO_ABI, GESTAGRO_ADDRESS } from "@/lib/contract";
import { FileText, Loader2 } from "lucide-react";

export function CreateCreditRequestForm() {
  const [amountEth, setAmountEth] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [metadataURI, setMetadataURI] = useState("");

  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    reset,
  } = useWriteContract({
    mutation: {
      onMutate: () => {
        toast.info("Confirm transaction in your wallet...");
      },
      onError: (error) => {
        toast.error("Transaction failed", {
          description: error.message.slice(0, 100),
        });
      },
    },
  });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  if (isSuccess && hash) {
    toast.success("Credit request created!", {
      id: `credit-${hash}`,
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountEth || !durationDays || !metadataURI.trim()) return;

    const amountWei = parseEther(amountEth);
    const durationSeconds = BigInt(Number(durationDays) * 86400);

    reset();
    writeContract({
      address: GESTAGRO_ADDRESS,
      abi: GESTAGRO_ABI,
      functionName: "createCreditRequest",
      args: [amountWei, durationSeconds, metadataURI.trim()],
    });
  };

  const isLoading = isWritePending || isConfirming;
  const isFormValid =
    amountEth && Number(amountEth) > 0 && durationDays && Number(durationDays) > 0 && metadataURI.trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5 text-primary" />
          Create Credit Request
        </CardTitle>
        <CardDescription>
          Submit a new credit request with amount, duration, and metadata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="amountEth">Amount (ETH)</Label>
            <Input
              id="amountEth"
              type="number"
              step="0.001"
              min="0"
              placeholder="1.5"
              value={amountEth}
              onChange={(e) => setAmountEth(e.target.value)}
              disabled={isLoading}
            />
            {amountEth && Number(amountEth) > 0 && (
              <p className="text-xs text-muted-foreground">
                {"= "}
                {parseEther(amountEth).toString()} wei
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="durationDays">Duration (days)</Label>
            <Input
              id="durationDays"
              type="number"
              min="1"
              placeholder="30"
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              disabled={isLoading}
            />
            {durationDays && Number(durationDays) > 0 && (
              <p className="text-xs text-muted-foreground">
                {"= "}
                {Number(durationDays) * 86400} seconds
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="metadataURI">Metadata URI</Label>
            <Input
              id="metadataURI"
              placeholder="ipfs://Qm..."
              value={metadataURI}
              onChange={(e) => setMetadataURI(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading || !isFormValid}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isConfirming ? "Confirming..." : "Sending..."}
              </>
            ) : (
              "Create Request"
            )}
          </Button>
          {hash && (
            <p className="text-xs text-muted-foreground">
              {"Tx: "}
              <a
                href={`https://sepolia.etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                {hash.slice(0, 10)}...{hash.slice(-8)}
              </a>
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
