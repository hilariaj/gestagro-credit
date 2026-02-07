# GestAgroCredit – Smart Contracts

This document describes the smart contracts used in the **GestAgroCredit** project, a DeFi MVP focused on improving access to credit for small and medium farmers using blockchain and ENS identity.

---

## 1- Concept

Farmers are identified using **ENS names** (e.g. `maria.agrocredit.eth`) instead of anonymous wallet addresses.

Each farmer can:
- Register using ENS ownership
- Create credit requests
- Cancel open requests

This MVP focuses on **identity + credit demand**, leaving funding logic for future versions.

---

## 2- Contracts

### `GestAgroCredit.sol`

Main registry contract.

---

## 3- External Dependencies

- **ENS Registry**
  - Used to verify ENS ownership
  - Interface: `IENSRegistry`
 
  Used only when `_validateENSOwnership = true`

---

## 4- Custom Errors

The contract uses Solidity custom errors to reduce gas usage and improve clarity.

- NotRegistered
- AlreadyRegistered
- InvalidENSOwner
- NotRequestOwner
- InvalidStatus

---

## 5- Farmer Registration

```md
```solidity
registerFarmer(string calldata ensName)
```

---

## 6- Credit Requests

Registered farmers can create credit requests describing their funding needs.
Each request is stored on-chain and associated with the farmer wallet and ENS identity.

### createCreditRequest

```solidity
function createCreditRequest(
    uint256 amountWei,
    uint256 durationSeconds,
    string calldata metadataURI
) external returns (uint256 id)


### Rules

- Caller must be a registered farmer
- amountWei must be greater than zero
- durationSeconds must be greater than zero

Each successful call increments nextRequestId and emits an event.

### Event

```solidity
CreditRequestCreated(
  uint256 id,
  address farmer,
  uint256 amountWei,
  uint256 durationSeconds,
  string metadataURI
)

---

## 7- Request Status Lifecycle

Each credit request follows a strict lifecycle controlled on-chain.

```solidity
enum RequestStatus {
    Open,        // 0
    Cancelled,   // 1
    Funded,      // 2 (future)
    Repaid       // 3 (future)
}

### Status rules
- Requests are created with status Open
- Only Open requests can be cancelled
- Once cancelled, the status is final and cannot be changed

This guarantees state integrity and prevents invalid transitions.

---

## 8- Cancel Credit Request

cancelRequest

```solidity
function cancelRequest(uint256 id) external

Allows a farmer to cancel their own credit request, only if it is still Open.

Security checks
- Only the request owner can cancel
- Requests not in Open state cannot be cancelled again

### Expected behavior
| Scenario                                | Result                   |
| --------------------------------------- | -------------------------|
| Owner cancels Open request              | ✅ Success              |
| Owner cancels already Cancelled request | ❌ `InvalidStatus()`    |
| Another address tries to cancel         | ❌ `NotRequestOwner()`  |


This behavior was tested in Remix VM and is intentional, ensuring robust state control.

