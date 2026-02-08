"use client";

import { useAccount, useReadContract } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GESTAGRO_ABI, GESTAGRO_ADDRESS } from "@/lib/contract";
import { User, RefreshCw } from "lucide-react";

export function GetFarmerPanel() {
  const { address, isConnected } = useAccount();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    address: GESTAGRO_ADDRESS,
    abi: GESTAGRO_ABI,
    functionName: "getFarmer",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
    },
  });

  const farmer = data
    ? {
        ensName: data[0] as string,
        ensNode: data[1] as string,
        isRegistered: data[2] as boolean,
        registeredAt: Number(data[3]),
      }
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="h-5 w-5 text-primary" />
              My Farmer Profile
            </CardTitle>
            <CardDescription>
              View your farmer registration data for the connected wallet
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            disabled={!isConnected}
            aria-label="Refresh farmer data"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <p className="text-sm text-muted-foreground">
            Connect your wallet to view farmer data.
          </p>
        ) : isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : isError ? (
          <p className="text-sm text-destructive">
            Error: {error?.message?.slice(0, 80) || "Failed to fetch"}
          </p>
        ) : farmer ? (
          <dl className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-muted-foreground">
                Registered
              </dt>
              <dd>
                <Badge variant={farmer.isRegistered ? "default" : "secondary"}>
                  {farmer.isRegistered ? "Yes" : "No"}
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-muted-foreground">
                ENS Name
              </dt>
              <dd className="text-sm font-mono text-foreground">
                {farmer.ensName || "N/A"}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm font-medium text-muted-foreground">
                ENS Node
              </dt>
              <dd className="break-all text-xs font-mono text-foreground">
                {farmer.ensNode}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-muted-foreground">
                Registered At
              </dt>
              <dd className="text-sm text-foreground">
                {farmer.registeredAt > 0
                  ? new Date(farmer.registeredAt * 1000).toLocaleString()
                  : "N/A"}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">No data returned.</p>
        )}
      </CardContent>
    </Card>
  );
}
