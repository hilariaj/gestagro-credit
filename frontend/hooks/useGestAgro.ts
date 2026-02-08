"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseEther } from "viem";

import { GESTAGRO_ABI, GESTAGRO_ADDRESS } from "@/lib/contract";

export function useGestAgroReads() {
  const { address } = useAccount();

  const farmer = useReadContract({
    abi: GESTAGRO_ABI,
    address: GESTAGRO_ADDRESS,
    functionName: "getFarmer",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const nextRequestId = useReadContract({
    abi: GESTAGRO_ABI,
    address: GESTAGRO_ADDRESS,
    functionName: "nextRequestId",
  });

  return { farmer, nextRequestId };
}

export function useGestAgroWrites() {
  const { writeContractAsync } = useWriteContract();

  async function registerFarmer(ensName: string) {
    return writeContractAsync({
      abi: GESTAGRO_ABI,
      address: GESTAGRO_ADDRESS,
      functionName: "registerFarmer",
      args: [ensName], // It has to be an array.
    });
  }

  async function createCreditRequest(params: {
    amountEth: string; // ex "0.01"
    durationDays: number; // ex 30
    metadataURI: string; // ex ipfs://... ou https://...
  }) {
    const amountWei = parseEther(params.amountEth);
    const durationSeconds = BigInt(params.durationDays) * 24n * 60n * 60n;

    return writeContractAsync({
      abi: GESTAGRO_ABI,
      address: GESTAGRO_ADDRESS,
      functionName: "createCreditRequest",
      args: [amountWei, durationSeconds, params.metadataURI],
    });
  }

  async function cancelRequest(id: bigint) {
    return writeContractAsync({
      abi: GESTAGRO_ABI,
      address: GESTAGRO_ADDRESS,
      functionName: "cancelRequest",
      args: [id],
    });
  }

  return { registerFarmer, createCreditRequest, cancelRequest };
}

export function useGetRequestById(id?: bigint) {
  return useReadContract({
    abi: GESTAGRO_ABI,
    address: GESTAGRO_ADDRESS,
    functionName: "getRequest",
    args: typeof id === "bigint" ? [id] : undefined,
    query: { enabled: typeof id === "bigint" },
  });
}
