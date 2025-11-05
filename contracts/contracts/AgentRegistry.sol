// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgentRegistry
 * @dev Registry for all AI agents on Somnia blockchain
 */
contract AgentRegistry is Ownable {
    // Agent information structure
    struct AgentInfo {
        string name;
        address agentAddress;
        address owner;
        uint256 createdAt;
        bool active;
    }

    // State variables
    mapping(address => AgentInfo) public agents;
    address[] public agentList;
    mapping(address => address[]) public agentsByOwner;

    // Events
    event AgentRegistered(
        address indexed agentAddress,
        string name,
        address indexed owner,
        uint256 timestamp
    );

    event AgentUnregistered(
        address indexed agentAddress,
        uint256 timestamp
    );

    event AgentUpdated(
        address indexed agentAddress,
        string newName,
        uint256 timestamp
    );

    /**
     * @dev Constructor
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Register a new agent
     * @param agentAddress Address of the agent contract
     * @param name Name of the agent
     */
    function registerAgent(
        address agentAddress,
        string memory name
    ) external {
        require(agentAddress != address(0), "Invalid agent address");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(!agents[agentAddress].active, "Agent already registered");

        agents[agentAddress] = AgentInfo({
            name: name,
            agentAddress: agentAddress,
            owner: msg.sender,
            createdAt: block.timestamp,
            active: true
        });

        agentList.push(agentAddress);
        agentsByOwner[msg.sender].push(agentAddress);

        emit AgentRegistered(agentAddress, name, msg.sender, block.timestamp);
    }

    /**
     * @dev Unregister an agent
     * @param agentAddress Address of the agent contract
     */
    function unregisterAgent(address agentAddress) external {
        require(agents[agentAddress].active, "Agent not registered");
        require(
            agents[agentAddress].owner == msg.sender,
            "Not agent owner"
        );

        agents[agentAddress].active = false;

        emit AgentUnregistered(agentAddress, block.timestamp);
    }

    /**
     * @dev Update agent name
     * @param agentAddress Address of the agent contract
     * @param newName New name for the agent
     */
    function updateAgentName(
        address agentAddress,
        string memory newName
    ) external {
        require(agents[agentAddress].active, "Agent not registered");
        require(
            agents[agentAddress].owner == msg.sender,
            "Not agent owner"
        );
        require(bytes(newName).length > 0, "Name cannot be empty");

        agents[agentAddress].name = newName;

        emit AgentUpdated(agentAddress, newName, block.timestamp);
    }

    /**
     * @dev Get agent information
     * @param agentAddress Address of the agent contract
     */
    function getAgent(address agentAddress)
        external
        view
        returns (AgentInfo memory)
    {
        require(agents[agentAddress].active, "Agent not registered");
        return agents[agentAddress];
    }

    /**
     * @dev Get all registered agents
     */
    function getAllAgents() external view returns (address[] memory) {
        return agentList;
    }

    /**
     * @dev Get agents by owner
     * @param owner Owner address
     */
    function getAgentsByOwner(address owner)
        external
        view
        returns (address[] memory)
    {
        return agentsByOwner[owner];
    }

    /**
     * @dev Get total number of agents
     */
    function getTotalAgents() external view returns (uint256) {
        return agentList.length;
    }

    /**
     * @dev Check if agent is registered
     * @param agentAddress Address of the agent contract
     */
    function isRegistered(address agentAddress) external view returns (bool) {
        return agents[agentAddress].active;
    }
}

