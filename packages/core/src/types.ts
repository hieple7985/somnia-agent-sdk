/**
 * Core types for SomniaAgent SDK
 */

import { TransactionReceipt } from 'ethers';

/**
 * Agent type classification
 */
export type AgentType = 'defi' | 'gaming' | 'governance' | 'custom';

/**
 * Agent autonomy level
 */
export type AutonomyLevel = 'low' | 'medium' | 'high';

/**
 * Agent status
 */
export type AgentStatus = 'idle' | 'running' | 'paused' | 'error';

/**
 * Network configuration
 */
export interface Network {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl?: string;
}

/**
 * Agent configuration
 */
export interface AgentConfig {
  /** Agent name */
  name: string;
  
  /** Agent type */
  type: AgentType;
  
  /** Autonomy level (default: 'medium') */
  autonomy?: AutonomyLevel;
  
  /** Events to listen for */
  triggers?: string[];
  
  /** Network to deploy on (default: 'testnet') */
  network?: Network | string;
  
  /** AI model to use */
  aiModel?: string;
  
  /** Custom RPC URL */
  rpcUrl?: string;
  
  /** Private key for signing transactions */
  privateKey?: string;
  
  /** Contract address (if already deployed) */
  contractAddress?: string;
}

/**
 * Agent metrics
 */
export interface AgentMetrics {
  /** Total number of actions executed */
  totalActions: number;
  
  /** Success rate (0-1) */
  successRate: number;
  
  /** Average gas used per action */
  avgGasUsed: number;
  
  /** Uptime in milliseconds */
  uptime: number;
  
  /** Last action timestamp */
  lastActionAt?: number;
}

/**
 * Agent state
 */
export interface AgentState {
  /** Current status */
  status: AgentStatus;
  
  /** Last executed action */
  lastAction: Action | null;
  
  /** Performance metrics */
  metrics: AgentMetrics;
  
  /** Custom state data */
  data: Record<string, any>;
  
  /** Contract address */
  contractAddress?: string;
}

/**
 * Action to be executed by agent
 */
export interface Action {
  /** Action type */
  type: string;
  
  /** Action parameters */
  params: Record<string, any>;
  
  /** Gas limit (optional) */
  gasLimit?: number;
  
  /** Gas price (optional) */
  gasPrice?: string;
  
  /** Timestamp */
  timestamp?: number;
}

/**
 * Action execution result
 */
export interface ExecutionResult {
  /** Whether execution was successful */
  success: boolean;
  
  /** Transaction hash */
  txHash: string;
  
  /** Transaction receipt */
  receipt: TransactionReceipt;
  
  /** Gas used */
  gasUsed: number;
  
  /** Error if failed */
  error?: Error;
  
  /** Timestamp */
  timestamp: number;
}

/**
 * Agent event
 */
export interface AgentEvent {
  /** Event type */
  type: string;
  
  /** Event timestamp */
  timestamp: number;
  
  /** Event data */
  data: any;
  
  /** Event source */
  source: string;
  
  /** Block number (if from blockchain) */
  blockNumber?: number;
  
  /** Transaction hash (if from blockchain) */
  txHash?: string;
}

/**
 * Event handler function
 */
export type EventHandler = (event: AgentEvent) => Promise<void> | void;

/**
 * Deployment options
 */
export interface DeploymentOptions {
  /** Network to deploy on */
  network: Network | string;
  
  /** Gas limit */
  gasLimit?: number;
  
  /** Gas price */
  gasPrice?: string;
  
  /** Whether to verify contract */
  verify?: boolean;
}

/**
 * Deployment result
 */
export interface DeploymentResult {
  /** Deployed contract address */
  contractAddress: string;
  
  /** Transaction hash */
  txHash: string;
  
  /** Block number */
  blockNumber: number;
  
  /** Gas used */
  gasUsed: number;
  
  /** Network deployed to */
  network: Network;
  
  /** Timestamp */
  timestamp: number;
}

/**
 * AI decision interface
 */
export interface AIDecision {
  /** Recommended action */
  action: string;
  
  /** Confidence level (0-1) */
  confidence: number;
  
  /** Reasoning/explanation */
  reasoning: string;
  
  /** Action parameters */
  params: Record<string, any>;
  
  /** Additional metadata */
  metadata?: {
    modelVersion?: string;
    processingTime?: number;
    [key: string]: any;
  };
}

/**
 * AI prediction interface
 */
export interface Prediction {
  /** Predicted value */
  value: number;
  
  /** Confidence level (0-1) */
  confidence: number;
  
  /** Timestamp */
  timestamp: number;
  
  /** Additional data */
  metadata?: Record<string, any>;
}

/**
 * AI interface for agent
 */
export interface AIInterface {
  /** Analyze data and return decision */
  analyze(data: any): Promise<AIDecision>;
  
  /** Make prediction */
  predict(input: any): Promise<Prediction>;
  
  /** Train model (optional) */
  train?(dataset: any): Promise<void>;
}

/**
 * Built-in agent events
 */
export enum AgentEvents {
  INITIALIZED = 'agent:initialized',
  STARTED = 'agent:started',
  STOPPED = 'agent:stopped',
  PAUSED = 'agent:paused',
  RESUMED = 'agent:resumed',
  ERROR = 'agent:error',
  ACTION_EXECUTED = 'agent:action_executed',
  STATE_CHANGED = 'agent:state_changed',
  DEPLOYED = 'agent:deployed',
}

/**
 * Error types
 */
export class AgentError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AgentError';
  }
}

export class DeploymentError extends AgentError {
  constructor(message: string) {
    super(message, 'DEPLOYMENT_ERROR');
    this.name = 'DeploymentError';
  }
}

export class ExecutionError extends AgentError {
  constructor(message: string) {
    super(message, 'EXECUTION_ERROR');
    this.name = 'ExecutionError';
  }
}

export class ConfigurationError extends AgentError {
  constructor(message: string) {
    super(message, 'CONFIGURATION_ERROR');
    this.name = 'ConfigurationError';
  }
}

