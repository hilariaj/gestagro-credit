"use client";

import { useReadContract } from "wagmi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GESTAGRO_ABI, GESTAGRO_ADDRESS } from "@/lib/contract";
import { Hash, RefreshCw } from "lucide-react";

export function LatestIdsWidget() {
  const { data, isLoading, refetch } = useReadContract({
    address: GESTAGRO_ADDRESS,
    abi: GESTAGRO_ABI,
    functionName: "nextRequestId",
  });

  const nextId = data !== undefined ? Number(data) : null;
  const lastId = nextId !== null && nextId > 0 ? nextId - 1 : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Hash className="h-4 w-4 text-primary" />
            Latest IDs
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => refetch()}
            aria-label="Refresh IDs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : nextId !== null ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Next Request ID
              </span>
              <Badge variant="outline" className="font-mono">
                {nextId}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Last Created ID
              </span>
              <Badge variant="secondary" className="font-mono">
                {lastId !== null ? lastId : "None yet"}
              </Badge>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Unable to read contract.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
