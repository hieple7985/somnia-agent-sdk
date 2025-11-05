// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BaseAgent
 * @dev Base contract for AI agents on Somnia blockchain
 */
contract BaseAgent is Ownable, ReentrancyGuard {
    // Agent types
    enum AgentType {
        DEFI,
        GAMING,
        GOVERNANCE,
        CUSTOM
    }

    // Agent status
    enum AgentStatus {
        IDLE,
        RUNNING,
        PAUSED,
        ERROR
    }

    // Agent information
    struct AgentInfo {
        string name;
        AgentType agentType;
        AgentStatus status;
        address owner;
        uint256 createdAt;
        uint256 totalActions;
    }

    // State variables
    AgentInfo public agentInfo;
    mapping(bytes32 => bool) public executedActions;

    // Events
    event ActionExecuted(
        string indexed actionType,
        bytes data,
        uint256 timestamp,
        bytes32 actionHash
    );

    event StatusChanged(
        AgentStatus oldStatus,
        AgentStatus newStatus,
        uint256 timestamp
    );

    event AgentInitialized(
        string name,
        AgentType agentType,
        address owner,
        uint256 timestamp
    );

    /**
     * @dev Constructor
     */
    constructor() Ownable(msg.sender) {
        // Owner is set by Ownable constructor
    }

    /**
     * @dev Initialize the agent
     * @param _name Agent name
     * @param _type Agent type
     */
    function initialize(
        string memory _name,
        AgentType _type
    ) external onlyOwner {
        require(agentInfo.createdAt == 0, "Already initialized");
        require(bytes(_name).length > 0, "Name cannot be empty");

        agentInfo = AgentInfo({
            name: _name,
            agentType: _type,
            status: AgentStatus.IDLE,
            owner: msg.sender,
            createdAt: block.timestamp,
            totalActions: 0
        });

        emit AgentInitialized(_name, _type, msg.sender, block.timestamp);
    }

    /**
     * @dev Execute an action
     * @param actionType Type of action
     * @param data Action data
     */
    function executeAction(
        string memory actionType,
        bytes memory data
    ) external onlyOwner nonReentrant returns (bool) {
        require(
            agentInfo.status == AgentStatus.RUNNING,
            "Agent is not running"
        );
        require(bytes(actionType).length > 0, "Action type cannot be empty");

        // Create action hash
        bytes32 actionHash = keccak256(
            abi.encodePacked(actionType, data, block.timestamp, agentInfo.totalActions)
        );

        // Check if action already executed (prevent replay)
        require(!executedActions[actionHash], "Action already executed");

        // Mark as executed
        executedActions[actionHash] = true;

        // Increment action counter
        agentInfo.totalActions++;

        // Emit event
        emit ActionExecuted(actionType, data, block.timestamp, actionHash);

        return true;
    }

    /**
     * @dev Update agent status
     * @param newStatus New status
     */
    function updateStatus(AgentStatus newStatus) external onlyOwner {
        AgentStatus oldStatus = agentInfo.status;
        require(oldStatus != newStatus, "Status unchanged");

        agentInfo.status = newStatus;

        emit StatusChanged(oldStatus, newStatus, block.timestamp);
    }

    /**
     * @dev Get agent information
     */
    function getInfo()
        external
        view
        returns (
            string memory name,
            AgentType agentType,
            AgentStatus status,
            address owner,
            uint256 createdAt,
            uint256 totalActions
        )
    {
        return (
            agentInfo.name,
            agentInfo.agentType,
            agentInfo.status,
            agentInfo.owner,
            agentInfo.createdAt,
            agentInfo.totalActions
        );
    }

    /**
     * @dev Check if action was executed
     * @param actionHash Action hash
     */
    function isActionExecuted(bytes32 actionHash) external view returns (bool) {
        return executedActions[actionHash];
    }

    /**
     * @dev Start the agent
     */
    function start() external onlyOwner {
        require(
            agentInfo.status == AgentStatus.IDLE ||
                agentInfo.status == AgentStatus.PAUSED,
            "Cannot start from current status"
        );

        AgentStatus oldStatus = agentInfo.status;
        agentInfo.status = AgentStatus.RUNNING;

        emit StatusChanged(oldStatus, AgentStatus.RUNNING, block.timestamp);
    }

    /**
     * @dev Stop the agent
     */
    function stop() external onlyOwner {
        require(
            agentInfo.status == AgentStatus.RUNNING,
            "Agent is not running"
        );

        AgentStatus oldStatus = agentInfo.status;
        agentInfo.status = AgentStatus.IDLE;

        emit StatusChanged(oldStatus, AgentStatus.IDLE, block.timestamp);
    }

    /**
     * @dev Pause the agent
     */
    function pause() external onlyOwner {
        require(
            agentInfo.status == AgentStatus.RUNNING,
            "Agent is not running"
        );

        AgentStatus oldStatus = agentInfo.status;
        agentInfo.status = AgentStatus.PAUSED;

        emit StatusChanged(oldStatus, AgentStatus.PAUSED, block.timestamp);
    }

    /**
     * @dev Resume the agent
     */
    function resume() external onlyOwner {
        require(
            agentInfo.status == AgentStatus.PAUSED,
            "Agent is not paused"
        );

        AgentStatus oldStatus = agentInfo.status;
        agentInfo.status = AgentStatus.RUNNING;

        emit StatusChanged(oldStatus, AgentStatus.RUNNING, block.timestamp);
    }

    /**
     * @dev Emergency stop
     */
    function emergencyStop() external onlyOwner {
        AgentStatus oldStatus = agentInfo.status;
        agentInfo.status = AgentStatus.ERROR;

        emit StatusChanged(oldStatus, AgentStatus.ERROR, block.timestamp);
    }
}

