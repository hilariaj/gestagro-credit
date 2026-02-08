"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
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
import { UserPlus, RefreshCcw, Loader2 } from "lucide-react";

type TxMode = "register" | "update";

export function RegisterFarmerForm() {
  const { address } = useAccount();

  // Inputs
  const [ensName, setEnsName] = useState("");
  const [newEnsName, setNewEnsName] = useState("");

  // Track which action we are sending (for correct success message)
  const [txMode, setTxMode] = useState<TxMode>("register");

  // Read farmer profile for connected wallet
  const farmerRead = useReadContract({
    address: GESTAGRO_ADDRESS,
    abi: GESTAGRO_ABI,
    functionName: "getFarmer",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const farmerData: any = farmerRead.data;

  const isRegistered = useMemo(() => {
    // Supports both tuple-as-object and tuple-as-array shapes
    return Boolean(farmerData?.isRegistered ?? farmerData?.[2] ?? false);
  }, [farmerData]);

  const currentEnsName = useMemo(() => {
    return String(farmerData?.ensName ?? farmerData?.[1] ?? "");
  }, [farmerData]);

  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    reset,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.info("Confirm transaction in your wallet..."),
      onError: (error) => {
        toast.error("Transaction failed", {
          description: (error?.message || "Unknown error").slice(0, 140),
        });
      },
    },
  });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  });

  // Show success toast once per tx
  useEffect(() => {
    if (!isSuccess || !hash) return;

    toast.success(
      txMode === "register"
        ? "Farmer registered successfully!"
        : "ENS updated successfully!",
      { id: `tx-${hash}` }
    );

    // Refresh reads after success
    farmerRead.refetch?.();
  }, [isSuccess, hash, txMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const isLoading = isWritePending || isConfirming;

  // Register farmer submit
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return toast.error("Connect your wallet first.");
    if (!ensName.trim()) return;

    reset();
    setTxMode("register");

    writeContract({
      address: GESTAGRO_ADDRESS,
      abi: GESTAGRO_ABI,
      functionName: "registerFarmer",
      args: [ensName.trim()],
    });
  };

  // Update ENS submit
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return toast.error("Connect your wallet first.");
    if (!newEnsName.trim()) return;

    reset();
    setTxMode("update");

    writeContract({
      address: GESTAGRO_ADDRESS,
      abi: GESTAGRO_ABI,
      functionName: "updateENS",
      args: [newEnsName.trim()],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          {!isRegistered ? (
            <>
              <UserPlus className="h-5 w-5 text-primary" />
              Register Farmer (ENS)
            </>
          ) : (
            <>
              <RefreshCcw className="h-5 w-5 text-primary" />
              Update ENS
            </>
          )}
        </CardTitle>
        <CardDescription>
          {!address
            ? "Connect your wallet to register or update your ENS name."
            : !isRegistered
              ? "Register your wallet with an ENS name on the GestAgro contract"
              : "You are already registered. Update your ENS name if needed."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!address ? (
          <div className="text-sm text-muted-foreground">
            Please connect your wallet first.
          </div>
        ) : !isRegistered ? (
          // REGISTER FORM
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ensName">ENS Name</Label>
              <Input
                id="ensName"
                placeholder="farmer.eth"
                value={ensName}
                onChange={(e) => setEnsName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" disabled={isLoading || !ensName.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isConfirming ? "Confirming..." : "Sending..."}
                </>
              ) : (
                "Register Farmer"
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
        ) : (
          // UPDATE ENS FORM
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div className="rounded-md border p-3 text-sm">
              <div className="text-muted-foreground">Already registered as</div>
              <div className="font-mono break-all">{currentEnsName || "N/A"}</div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="newEnsName">New ENS Name</Label>
              <Input
                id="newEnsName"
                placeholder="eduarda.agrocredit.eth"
                value={newEnsName}
                onChange={(e) => setNewEnsName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" disabled={isLoading || !newEnsName.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isConfirming ? "Confirming..." : "Sending..."}
                </>
              ) : (
                "Update ENS"
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
        )}
      </CardContent>
    </Card>
  );
}
