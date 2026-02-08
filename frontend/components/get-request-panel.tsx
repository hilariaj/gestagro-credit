"use client";

import React from "react"

import { useState } from "react";
import { useReadContract } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GESTAGRO_ABI, GESTAGRO_ADDRESS } from "@/lib/contract";
import { Search, Loader2 } from "lucide-react";
import { formatEther } from "viem";

const STATUS_MAP: Record<number, string> = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
  3: "Repaid",
  4: "Defaulted",
};

export function GetRequestPanel() {
  const [requestId, setRequestId] = useState("");
  const [queryId, setQueryId] = useState<bigint | null>(null);

  const { data, isLoading, isError, error } = useReadContract({
    address: GESTAGRO_ADDRESS,
    abi: GESTAGRO_ABI,
    functionName: "getRequest",
    args: queryId !== null ? [queryId] : undefined,
    query: {
      enabled: queryId !== null,
    },
  });

  const request = data
    ? {
        farmer: data[0] as string,
        amountWei: data[1] as bigint,
        durationSeconds: Number(data[2]),
        metadataURI: data[3] as string,
        status: Number(data[4]),
        createdAt: Number(data[5]),
      }
    : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestId === "" || Number.isNaN(Number(requestId))) return;
    setQueryId(BigInt(requestId));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Search className="h-5 w-5 text-primary" />
          Get Request by ID
        </CardTitle>
        <CardDescription>
          Look up a specific credit request by its numeric ID
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="requestId" className="sr-only">
              Request ID
            </Label>
            <Input
              id="requestId"
              type="number"
              min="0"
              placeholder="Enter request ID"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={!requestId}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Fetch"
            )}
          </Button>
        </form>

        {isError && (
          <p className="text-sm text-destructive">
            Error: {error?.message?.slice(0, 80) || "Failed to fetch"}
          </p>
        )}

        {request && queryId !== null && (
          <dl className="flex flex-col gap-3 rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-muted-foreground">
                Status
              </dt>
              <dd>
                <Badge variant={request.status === 1 ? "default" : "secondary"}>
                  {STATUS_MAP[request.status] ?? `Unknown (${request.status})`}
                </Badge>
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm font-medium text-muted-foreground">
                Farmer
              </dt>
              <dd className="break-all text-xs font-mono text-foreground">
                {request.farmer}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-muted-foreground">
                Amount
              </dt>
              <dd className="text-sm font-mono text-foreground">
                {formatEther(request.amountWei)} ETH
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-muted-foreground">
                Duration
              </dt>
              <dd className="text-sm text-foreground">
                {Math.round(request.durationSeconds / 86400)} days (
                {request.durationSeconds}s)
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm font-medium text-muted-foreground">
                Metadata URI
              </dt>
              <dd className="break-all text-xs font-mono text-foreground">
                {request.metadataURI || "N/A"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-muted-foreground">
                Created At
              </dt>
              <dd className="text-sm text-foreground">
                {request.createdAt > 0
                  ? new Date(request.createdAt * 1000).toLocaleString()
                  : "N/A"}
              </dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  );
}
