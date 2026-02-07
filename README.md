# 🌱 GestaAgroCredit

**GestaAgroCredit** is a DeFi MVP designed to improve access to credit for small and medium farmers using blockchain and decentralized identity.

This project is being developed as part of a **Hackmoney2026 Hackathon**, with a strong focus on simplicity, transparency, and real-world impact.

---

## Problem

Small and medium farmers often face major barriers when trying to access credit:

- Lack of formal credit history
- Bureaucratic and centralized processes
- No digital identity or reputation system
- Exclusion from traditional financial systems

---

## Solution

GestaAgroCredit proposes a **decentralized credit registry** where:

- Farmers are identified using **ENS names** instead of anonymous wallet addresses
- Credit requests are registered on-chain
- Identity and transparency are prioritized from day one

This MVP focuses on **identity + credit demand**, leaving funding and repayment logic for future versions.

---

## Architecture (MVP)

- **Blockchain**: Ethereum (testnets)
- **Smart Contracts**: Solidity
- **Identity**: ENS (Ethereum Name Service)
- **Frontend**: Planned (wallet connection + simple UI)

---

## Smart Contracts

The core logic lives in the smart contract:

- `contracts/GestAgroCredit.sol`

📘 Full technical documentation is available here:  
👉 [`README.contracts.md`](./README.contracts.md)

---

## Tech Stack

- **Solidity ^0.8.x**
- **Ethereum**
- **ENS (Ethereum Name Service)**
- **Remix IDE** (development & testing)
- **IPFS** (metadata – optional / future)

---

## ENS Integration (Important)

This project integrates ENS according to the official ENS documentation:

- Uses the **ENS Registry** contract
- Uses **ENS namehash** to generate node identifiers
- Optionally validates ENS ownership using `ens.owner(node)`
- ENS is used as a **decentralized identity**, not as a resolver
  
---

## Current Status

- ✅ Smart contract implemented
- ✅ ENS-based farmer registration
- ✅ Credit request creation
- ⏳ Frontend (in progress)
- ✅ Deployment to testnet

---

## Roadmap (Post-Hackathon)

- Funding and repayment logic
- Stablecoin integration
- Farmer reputation scoring
- DAO-based credit evaluation
- Integration with real-world agricultural data

---

## Contributing

This project is evolving. Contributions, ideas, and feedback are welcome.

---

## Author

**Hilaria Eduarda Jesus**  
Blockchain & Web3 Developer
