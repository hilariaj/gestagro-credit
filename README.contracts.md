# GestAgroCredit – Smart Contracts

This document describes the smart contracts used in the **GestAgroCredit** project, a DeFi MVP focused on improving access to credit for small and medium farmers using blockchain and ENS identity.

---

## Concept

Farmers are identified using **ENS names** (e.g. `maria.agrocredit.eth`) instead of anonymous wallet addresses.

Each farmer can:
- Register using ENS ownership
- Create credit requests
- Cancel open requests

This MVP focuses on **identity + credit demand**, leaving funding logic for future versions.

---

## Contracts

### `GestAgroCredit.sol`

Main registry contract.

---

## External Dependencies

- **ENS Registry**
  - Used to verify ENS ownership
  - Interface: `IENSRegistry`

---

## Farmer Registration

```solidity
registerFarmer(bytes32 ensNode, string ensName)
