// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BaseAgent.sol";
import "./AgentRegistry.sol";

/**
 * @title AgentFactory
 * @dev Factory contract for creating AI agents
 */
contract AgentFactory {
    // Registry contract
    AgentRegistry public registry;

    // Events
    event AgentCreated(
        address indexed agentAddress,
        address indexed owner,
        string name,
        BaseAgent.AgentType agentType,
        uint256 timestamp
    );

    /**
     * @dev Constructor
     * @param _registry Address of the registry contract
     */
    constructor(address _registry) {
        require(_registry != address(0), "Invalid registry address");
        registry = AgentRegistry(_registry);
    }

    /**
     * @dev Create a new agent
     * @param name Agent name
     * @param agentType Agent type
     */
    function createAgent(
        string memory name,
        BaseAgent.AgentType agentType
    ) external returns (address) {
        require(bytes(name).length > 0, "Name cannot be empty");

        // Deploy new BaseAgent contract
        BaseAgent agent = new BaseAgent();

        // Transfer ownership to caller
        agent.transferOwnership(msg.sender);

        // Initialize the agent
        agent.initialize(name, agentType);

        // Register in registry
        registry.registerAgent(address(agent), name);

        emit AgentCreated(
            address(agent),
            msg.sender,
            name,
            agentType,
            block.timestamp
        );

        return address(agent);
    }

    /**
     * @dev Create multiple agents in batch
     * @param names Array of agent names
     * @param agentTypes Array of agent types
     */
    function createAgentsBatch(
        string[] memory names,
        BaseAgent.AgentType[] memory agentTypes
    ) external returns (address[] memory) {
        require(names.length == agentTypes.length, "Array length mismatch");
        require(names.length > 0, "Empty arrays");

        address[] memory agents = new address[](names.length);

        for (uint256 i = 0; i < names.length; i++) {
            // Deploy new BaseAgent contract
            BaseAgent agent = new BaseAgent();

            // Transfer ownership to caller
            agent.transferOwnership(msg.sender);

            // Initialize the agent
            agent.initialize(names[i], agentTypes[i]);

            // Register in registry
            registry.registerAgent(address(agent), names[i]);

            agents[i] = address(agent);

            emit AgentCreated(
                address(agent),
                msg.sender,
                names[i],
                agentTypes[i],
                block.timestamp
            );
        }

        return agents;
    }

    /**
     * @dev Get registry address
     */
    function getRegistry() external view returns (address) {
        return address(registry);
    }
}

