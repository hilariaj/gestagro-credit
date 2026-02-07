// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


/// @notice Minimal ENS Registry interface (mainnet + testnets have same ABI)
interface IENSRegistry {
    function owner(bytes32 node) external view returns (address);
}


/// @title GestAgroCredit - MVP Registry for ENS-identified farmers and credit requests
contract GestAgroCredit {
    // #########################
    // Types
    // #########################
    struct FarmerProfile {
        bytes32 ensNode;      // namehash of ENS name
        string ensName;       // readable ENS
        bool isRegistered;
        uint256 registeredAt;
    }

    enum RequestStatus {
        Open,
        Cancelled,
        Funded,         //future
        Repaid          //future
    }

    struct CreditRequest {
        uint256 id;
        address farmer;
        uint256 amountWei;
        uint256 durationSeconds;
        string metadataURI;
        RequestStatus status;
        uint256 createdAt;
    }


    // #########################
    // Storage
    // #########################
    IENSRegistry public immutable ens; // ENS Registry address (can be 0x0 if you skip validation)
    bool public immutable validateENSOwnership;

    mapping(address => FarmerProfile) public farmers;
    mapping(uint256 => CreditRequest) public requests;
    uint256 public nextRequestId;
    

    // #########################
    // Events
    // #########################
    event FarmerRegistered(address indexed farmer, string ensName, bytes32 ensNode);
    event CreditRequestCreated(uint256 indexed id, address indexed farmer, uint256 amountWei, uint256 durationSeconds, string metadataURI);
    event CreditRequestCancelled(uint256 indexed id, address indexed farmer);

    // ##################################################
    // Errors
    // ##################################################
    error NotRegistered();
    error AlreadyRegistered();
    error InvalidENSOwner();
    error NotRequestOwner();
    error InvalidStatus();

    // ##################################################
    // Constructor
    // ##################################################
    /// @param ensRegistry Address of ENS registry (mainnet: 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e)
    /// @param _validateENSOwnership If true, require ENS.owner(namehash) == msg.sender
    constructor(address ensRegistry, bool _validateENSOwnership) {
        ens = IENSRegistry(ensRegistry);
        validateENSOwnership = _validateENSOwnership;
    }


    // ##################################################
    // ENS namehash
    // ##################################################
     /// @notice Namehash per ENS spec (recursive keccak)
    function namehash(string memory name) public pure returns (bytes32) {
        bytes memory s = bytes(name);
        if (s.length == 0) return bytes32(0);

        bytes32 node = bytes32(0);
        uint256 i = s.length;

        while (i > 0) {
            uint256 start = i;

            // move i left until '.' or start
            while (i > 0 && s[i - 1] != bytes1(".")) {
                i--;
            }

            // label = s[i..start-1]
            bytes32 labelHash = keccak256(_substring(s, i, start - i));
            node = keccak256(abi.encodePacked(node, labelHash));

            // skip '.'
            if (i > 0) i--;
        }

        return node;
    }


    function _substring(bytes memory str, uint256 start, uint256 len) private pure returns (bytes memory) {
        bytes memory out = new bytes(len);
        for (uint256 j = 0; j < len; j++) {
            out[j] = str[start + j];
        }
        return out;
    }


    // ##################################################
    // Farmer Registry (ENS)
    // ##################################################
    function registerFarmer(string calldata ensName) external {
        if (farmers[msg.sender].isRegistered) revert AlreadyRegistered();

        bytes32 node = namehash(ensName);

        // ownership validation (recommended if you’re on a network where ENS registry works)
        if (validateENSOwnership) {
            // ensRegistry must be correct, and the ENS name must exist & be owned
            if (ens.owner(node) != msg.sender) revert InvalidENSOwner();
        }

        farmers[msg.sender] = FarmerProfile({
            ensNode: node,
            ensName: ensName,
            isRegistered: true,
            registeredAt: block.timestamp
        });

        emit FarmerRegistered(msg.sender, ensName, node);
    }

    function updateENS(string calldata newEnsName) external {
        if (!farmers[msg.sender].isRegistered) revert NotRegistered();

        bytes32 node = namehash(newEnsName);

        if (validateENSOwnership) {
            if (ens.owner(node) != msg.sender) revert InvalidENSOwner();
        }

        farmers[msg.sender].ensName = newEnsName;
        farmers[msg.sender].ensNode = node;

        emit FarmerRegistered(msg.sender, newEnsName, node);
    }

    // ##################################################
    // Credit Requests
    // ##################################################
    function createCreditRequest(
        uint256 amountWei,
        uint256 durationSeconds,
        string calldata metadataURI
    ) external returns (uint256 id) {
        if (!farmers[msg.sender].isRegistered) revert NotRegistered();
        require(amountWei > 0, "amount=0");
        require(durationSeconds > 0, "duration=0");

        id = nextRequestId++;
        requests[id] = CreditRequest({
            id: id,
            farmer: msg.sender,
            amountWei: amountWei,
            durationSeconds: durationSeconds,
            metadataURI: metadataURI,
            status: RequestStatus.Open,
            createdAt: block.timestamp
        });

        emit CreditRequestCreated(id, msg.sender, amountWei, durationSeconds, metadataURI);
    }

    function cancelRequest(uint256 id) external {
        CreditRequest storage r = requests[id];
        if (r.farmer != msg.sender) revert NotRequestOwner();
        if (r.status != RequestStatus.Open) revert InvalidStatus();

        r.status = RequestStatus.Cancelled;
        emit CreditRequestCancelled(id, msg.sender);
    }

    // ##################################################
    // Read helpers (for UI)
    // ##################################################
    function getRequest(uint256 id) external view returns (CreditRequest memory) {
        return requests[id];
    }

    function getFarmer(address farmer) external view returns (FarmerProfile memory) {
        return farmers[farmer];
    }
    


}
