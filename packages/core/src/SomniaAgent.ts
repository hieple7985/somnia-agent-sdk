/**
 * SomniaAgent - Core agent class
 */

import EventEmitter from 'eventemitter3';
import { ethers } from 'ethers';
import {
  AgentConfig,
  AgentState,
  AgentStatus,
  AgentEvents,
  AgentEvent,
  EventHandler,
  Action,
  ExecutionResult,
  DeploymentOptions,
  DeploymentResult,
  AIInterface,
  AgentMetrics,
  ConfigurationError,
  ExecutionError,
  DeploymentError,
} from './types';
import { Networks } from './networks';

/**
 * Main SomniaAgent class
 */
export class SomniaAgent {
  private config: AgentConfig;
  private state: AgentState;
  private eventEmitter: EventEmitter;
  private provider?: ethers.Provider;
  private signer?: ethers.Signer;
  private contract?: ethers.Contract;
  private startTime?: number;
  private aiInterface?: AIInterface;

  constructor(config: AgentConfig) {
    this.validateConfig(config);
    this.config = {
      autonomy: 'medium',
      triggers: [],
      ...config,
    };

    this.eventEmitter = new EventEmitter();
    this.state = {
      status: 'idle',
      lastAction: null,
      metrics: {
        totalActions: 0,
        successRate: 1,
        avgGasUsed: 0,
        uptime: 0,
      },
      data: {},
    };
  }

  /**
   * Initialize the agent
   * Sets up blockchain connection and loads contract if already deployed
   */
  async init(): Promise<void> {
    try {
      // Connect to Somnia network
      // Using JsonRpcProvider instead of WebSocketProvider for better stability
      const network = this.getNetwork();
      this.provider = new ethers.JsonRpcProvider(network.rpcUrl);

      // Set up signer for transaction signing
      // Private key is optional - only needed if agent will execute transactions
      if (this.config.privateKey) {
        this.signer = new ethers.Wallet(this.config.privateKey, this.provider);
      }

      // Load existing contract if address is provided
      // This is useful when reconnecting to an already deployed agent
      if (this.config.contractAddress) {
        await this.loadContract(this.config.contractAddress);
      }

      this.emit(AgentEvents.INITIALIZED, {
        name: this.config.name,
        type: this.config.type,
      });
    } catch (error) {
      throw new ConfigurationError(
        `Failed to initialize agent: ${(error as Error).message}`
      );
    }
  }

  /**
   * Start the agent
   */
  async start(): Promise<void> {
    if (this.state.status === 'running') {
      return;
    }

    this.state.status = 'running';
    this.startTime = Date.now();

    // Subscribe to triggers
    if (this.config.triggers && this.config.triggers.length > 0) {
      await this.subscribeToEvents(this.config.triggers);
    }

    this.emit(AgentEvents.STARTED, {
      timestamp: this.startTime,
    });
  }

  /**
   * Stop the agent
   */
  async stop(): Promise<void> {
    if (this.state.status !== 'running') {
      return;
    }

    this.state.status = 'idle';

    // Update uptime
    if (this.startTime) {
      this.state.metrics.uptime += Date.now() - this.startTime;
    }

    this.emit(AgentEvents.STOPPED, {
      uptime: this.state.metrics.uptime,
    });
  }

  /**
   * Pause the agent
   */
  async pause(): Promise<void> {
    if (this.state.status !== 'running') {
      return;
    }

    this.state.status = 'paused';
    this.emit(AgentEvents.PAUSED, {});
  }

  /**
   * Resume the agent
   */
  async resume(): Promise<void> {
    if (this.state.status !== 'paused') {
      return;
    }

    this.state.status = 'running';
    this.emit(AgentEvents.RESUMED, {});
  }

  /**
   * Execute an action on the blockchain
   * This sends a transaction to the agent's smart contract
   */
  async execute(action: Action): Promise<ExecutionResult> {
    if (!this.contract || !this.signer) {
      throw new ExecutionError('Agent not properly initialized or deployed');
    }

    const startTime = Date.now();

    try {
      // Encode action params as bytes for contract call
      // We serialize to JSON then convert to UTF-8 bytes
      const tx = await this.contract.executeAction(
        action.type,
        ethers.toUtf8Bytes(JSON.stringify(action.params)),
        {
          gasLimit: action.gasLimit,
          gasPrice: action.gasPrice,
        }
      );

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      // Track success metrics
      this.updateMetrics(true, Number(receipt.gasUsed));

      const result: ExecutionResult = {
        success: true,
        txHash: receipt.hash,
        receipt,
        gasUsed: Number(receipt.gasUsed),
        timestamp: Date.now(),
      };

      this.state.lastAction = action;
      this.emit(AgentEvents.ACTION_EXECUTED, {
        action,
        result,
      });

      return result;
    } catch (error) {
      // Track failure metrics
      this.updateMetrics(false, 0);

      const result: ExecutionResult = {
        success: false,
        txHash: '',
        receipt: {} as any,
        gasUsed: 0,
        error: error as Error,
        timestamp: Date.now(),
      };

      this.emit(AgentEvents.ERROR, {
        action,
        error: (error as Error).message,
      });

      throw new ExecutionError(`Action execution failed: ${(error as Error).message}`);
    }
  }

  /**
   * Register event handler
   */
  onEvent(event: string, handler: EventHandler): void {
    this.eventEmitter.on(event, handler);
  }

  /**
   * Remove event handler
   */
  offEvent(event: string, handler: EventHandler): void {
    this.eventEmitter.off(event, handler);
  }

  /**
   * Get current state
   */
  getState(): AgentState {
    return { ...this.state };
  }

  /**
   * Update state
   */
  setState(partialState: Partial<AgentState>): void {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...partialState };

    this.emit(AgentEvents.STATE_CHANGED, {
      oldState,
      newState: this.state,
    });
  }

  /**
   * Deploy agent to blockchain
   *
   * TODO: This is currently a mock implementation
   * Need to implement actual contract deployment using ethers ContractFactory
   * See: https://docs.ethers.org/v6/api/contract/#ContractFactory
   */
  async deploy(options: DeploymentOptions): Promise<DeploymentResult> {
    if (!this.signer) {
      throw new DeploymentError('No signer configured. Provide private key in config.');
    }

    try {
      // TODO: Implement actual contract deployment
      // Steps needed:
      // 1. Load BaseAgent contract ABI and bytecode
      // 2. Create ContractFactory
      // 3. Deploy with constructor params
      // 4. Wait for deployment transaction
      // 5. Register in AgentRegistry

      // For now, return mock result for testing
      const mockAddress = ethers.Wallet.createRandom().address;
      const network = this.getNetwork();

      const result: DeploymentResult = {
        contractAddress: mockAddress,
        txHash: '0x' + '0'.repeat(64),
        blockNumber: 0,
        gasUsed: 0,
        network,
        timestamp: Date.now(),
      };

      this.config.contractAddress = mockAddress;
      this.state.contractAddress = mockAddress;

      this.emit(AgentEvents.DEPLOYED, result);

      return result;
    } catch (error) {
      throw new DeploymentError(`Deployment failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get AI interface
   *
   * Returns a mock AI interface by default. Users should call setAI() to provide
   * their own AI implementation (e.g., TensorFlow, PyTorch, or API-based models)
   */
  get ai(): AIInterface {
    if (!this.aiInterface) {
      // Return mock AI interface for now
      // TODO: Consider adding a warning log when using mock AI
      this.aiInterface = {
        analyze: async (data: any) => ({
          action: 'hold',
          confidence: 0.5,
          reasoning: 'No AI model configured - using default hold strategy',
          params: {},
        }),
        predict: async (input: any) => ({
          value: 0,
          confidence: 0,
          timestamp: Date.now(),
        }),
      };
    }
    return this.aiInterface;
  }

  /**
   * Set AI interface
   */
  setAI(ai: AIInterface): void {
    this.aiInterface = ai;
  }

  // Private methods

  private validateConfig(config: AgentConfig): void {
    if (!config.name) {
      throw new ConfigurationError('Agent name is required');
    }
    if (!config.type) {
      throw new ConfigurationError('Agent type is required');
    }
  }

  private getNetwork() {
    if (typeof this.config.network === 'string') {
      const network = Networks[this.config.network];
      if (!network) {
        throw new ConfigurationError(`Unknown network: ${this.config.network}`);
      }
      return network;
    }
    return this.config.network || Networks.testnet;
  }

  private async loadContract(address: string): Promise<void> {
    // TODO: Load actual contract ABI from artifacts or etherscan
    // For now, using minimal ABI for basic functionality
    const abi = [
      'function executeAction(string actionType, bytes data) external returns (bool)',
      'function getInfo() external view returns (string, uint8, uint8, address)',
    ];

    this.contract = new ethers.Contract(address, abi, this.signer || this.provider);
  }

  private async subscribeToEvents(events: string[]): Promise<void> {
    // TODO: Implement actual event subscription using contract.on() or WebSocket
    // Current limitation: This is just a placeholder
    // Need to implement proper event filtering and handling
    // See: https://docs.ethers.org/v6/api/contract/#ContractEvent
    console.log(`Subscribed to events: ${events.join(', ')}`);
  }

  private emit(event: string, data: any): void {
    const agentEvent: AgentEvent = {
      type: event,
      timestamp: Date.now(),
      data,
      source: this.config.name,
    };

    this.eventEmitter.emit(event, agentEvent);
  }

  private updateMetrics(success: boolean, gasUsed: number): void {
    const metrics = this.state.metrics;
    const totalActions = metrics.totalActions + 1;
    const successfulActions = success
      ? metrics.totalActions * metrics.successRate + 1
      : metrics.totalActions * metrics.successRate;

    this.state.metrics = {
      totalActions,
      successRate: successfulActions / totalActions,
      avgGasUsed: (metrics.avgGasUsed * metrics.totalActions + gasUsed) / totalActions,
      uptime: metrics.uptime,
      lastActionAt: Date.now(),
    };
  }
}

