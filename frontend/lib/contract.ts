
export const GESTAGRO_ADDRESS = "0x305BB4E2E2B3cB3a47d5133211213fC39b861Ebd" as const;


// ABI copied from Etherscan (Contract ABI)
export const GESTAGRO_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "ensRegistry", "type": "address" },
      { "internalType": "bool", "name": "_validateENSOwnership", "type": "bool" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  { "inputs": [], "name": "AlreadyRegistered", "type": "error" },
  { "inputs": [], "name": "InvalidENSOwner", "type": "error" },
  { "inputs": [], "name": "InvalidStatus", "type": "error" },
  { "inputs": [], "name": "NotRegistered", "type": "error" },
  { "inputs": [], "name": "NotRequestOwner", "type": "error" },

  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "farmer", "type": "address" }
    ],
    "name": "CreditRequestCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "farmer", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amountWei", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "durationSeconds", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "metadataURI", "type": "string" }
    ],
    "name": "CreditRequestCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "farmer", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "ensName", "type": "string" },
      { "indexed": false, "internalType": "bytes32", "name": "ensNode", "type": "bytes32" }
    ],
    "name": "FarmerRegistered",
    "type": "event"
  },

  { "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "cancelRequest", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  {
    "inputs": [
      { "internalType": "uint256", "name": "amountWei", "type": "uint256" },
      { "internalType": "uint256", "name": "durationSeconds", "type": "uint256" },
      { "internalType": "string", "name": "metadataURI", "type": "string" }
    ],
    "name": "createCreditRequest",
    "outputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  { "inputs": [], "name": "ens", "outputs": [{ "internalType": "contract IENSRegistry", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  {
    "inputs": [{ "internalType": "address", "name": "farmer", "type": "address" }], "name": "getFarmer", "outputs": [{
      "components": [
        { "internalType": "bytes32", "name": "ensNode", "type": "bytes32" },
        { "internalType": "string", "name": "ensName", "type": "string" },
        { "internalType": "bool", "name": "isRegistered", "type": "bool" },
        { "internalType": "uint256", "name": "registeredAt", "type": "uint256" }
      ], "internalType": "struct GestAgroCredit.FarmerProfile", "name": "", "type": "tuple"
    }], "stateMutability": "view", "type": "function"
  },

  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "getRequest", "outputs": [{
      "components": [
        { "internalType": "uint256", "name": "id", "type": "uint256" },
        { "internalType": "address", "name": "farmer", "type": "address" },
        { "internalType": "uint256", "name": "amountWei", "type": "uint256" },
        { "internalType": "uint256", "name": "durationSeconds", "type": "uint256" },
        { "internalType": "string", "name": "metadataURI", "type": "string" },
        { "internalType": "uint8", "name": "status", "type": "uint8" },
        { "internalType": "uint256", "name": "createdAt", "type": "uint256" }
      ], "internalType": "struct GestAgroCredit.CreditRequest", "name": "", "type": "tuple"
    }], "stateMutability": "view", "type": "function"
  },

  { "inputs": [], "name": "nextRequestId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "ensName", "type": "string" }], "name": "registerFarmer", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "newEnsName", "type": "string" }], "name": "updateENS", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "validateENSOwnership", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }
] as const;
