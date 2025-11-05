# SomniaAgent SDK - System Architecture

**Version:** 1.0  
**Date:** November 5, 2025  
**Status:** 🎨 Design Phase

---

## 🏗️ HIGH-LEVEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                      DEVELOPER INTERFACE                         │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │  CLI Tool    │  │  VS Code Ext │  │  Web Dashboard         │ │
│  │  (Terminal)  │  │  (Optional)  │  │  (Monitoring)          │ │
│  └──────────────┘  └──────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      SOMNIAAGENT SDK                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  @somniaagent/core - Core Framework                        │ │
│  │  - SomniaAgent class                                       │ │
│  │  - Event system                                            │ │
│  │  │  - State management                                      │ │
│  │  - Lifecycle hooks                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  @somniaagent/ai - AI/ML Integration                       │ │
│  │  - Python bridge                                           │ │
│  │  - Model loader                                            │ │
│  │  - Inference engine                                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  @somniaagent/testing - Testing Framework                  │ │
│  │  - Agent simulator                                         │ │
│  │  - Event mocking                                           │ │
│  │  - Scenario runner                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  @somniaagent/cli - Command Line Interface                 │ │
│  │  - Project scaffolding                                     │ │
│  │  - Deployment automation                                   │ │
│  │  - Testing commands                                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  @somniaagent/dashboard - Web Dashboard                    │ │
│  │  - Real-time monitoring                                    │ │
│  │  - Analytics & metrics                                     │ │
│  │  - Agent management UI                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BLOCKCHAIN LAYER                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Smart Contracts (Solidity)                                │ │
│  │  - BaseAgent.sol                                           │ │
│  │  - AgentRegistry.sol                                       │ │
│  │  - AgentFactory.sol                                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Somnia Blockchain                                         │ │
│  │  - 1M+ TPS                                                 │ │
│  │  - Sub-second finality                                     │ │
│  │  - EVM-compatible                                          │ │
│  │  - AI/ML Python layer                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 PACKAGE ARCHITECTURE

### Monorepo Structure

```
somniaagent-sdk/
├── packages/
│   ├── core/              # @somniaagent/core
│   ├── ai/                # @somniaagent/ai
│   ├── testing/           # @somniaagent/testing
│   ├── cli/               # @somniaagent/cli
│   └── dashboard/         # @somniaagent/dashboard
├── contracts/             # Smart contracts
├── templates/             # Agent templates
├── examples/              # Example projects
└── docs/                  # Documentation
```

---

## 🎯 CORE PACKAGE (@somniaagent/core)

### Class Diagram

```typescript
// Base Agent Class
class SomniaAgent {
  // Properties
  private config: AgentConfig;
  private state: AgentState;
  private eventEmitter: EventEmitter;
  private contract: Contract;
  
  // Lifecycle
  constructor(config: AgentConfig);
  async init(): Promise<void>;
  async start(): Promise<void>;
  async stop(): Promise<void>;
  async destroy(): Promise<void>;
  
  // Event Handling
  onEvent(event: string, handler: EventHandler): void;
  emit(event: string, data: any): void;
  
  // State Management
  getState(): AgentState;
  setState(state: Partial<AgentState>): void;
  
  // Execution
  async execute(action: Action): Promise<TransactionReceipt>;
  
  // AI Integration
  ai: AIInterface;
  
  // Deployment
  async deploy(network: Network): Promise<DeploymentResult>;
}

// Configuration
interface AgentConfig {
  name: string;
  type: AgentType;
  autonomy: 'low' | 'medium' | 'high';
  triggers: string[];
  network?: Network;
  aiModel?: string;
}

// State
interface AgentState {
  status: 'idle' | 'running' | 'paused' | 'error';
  lastAction: Action | null;
  metrics: AgentMetrics;
  data: Record<string, any>;
}

// Events
type EventHandler = (event: AgentEvent) => Promise<void>;

interface AgentEvent {
  type: string;
  timestamp: number;
  data: any;
  source: string;
}
```

### Event System

```typescript
// Event Emitter
class AgentEventEmitter extends EventEmitter {
  // Subscribe to blockchain events
  async subscribeToChainEvents(events: string[]): Promise<void>;
  
  // Subscribe to custom events
  on(event: string, handler: EventHandler): void;
  
  // Emit events
  emit(event: string, data: any): void;
  
  // Unsubscribe
  off(event: string, handler: EventHandler): void;
}

// Built-in Events
enum AgentEvents {
  INITIALIZED = 'agent:initialized',
  STARTED = 'agent:started',
  STOPPED = 'agent:stopped',
  ERROR = 'agent:error',
  ACTION_EXECUTED = 'agent:action_executed',
  STATE_CHANGED = 'agent:state_changed',
}
```

---

## 🤖 AI PACKAGE (@somniaagent/ai)

### Architecture

```typescript
// AI Interface
interface AIInterface {
  analyze(data: any): Promise<AIDecision>;
  predict(input: any): Promise<Prediction>;
  train(dataset: any): Promise<void>;
}

// AI Model Manager
class AIModelManager {
  private models: Map<string, AIModel>;
  
  async loadModel(name: string, config: ModelConfig): Promise<AIModel>;
  async unloadModel(name: string): Promise<void>;
  getModel(name: string): AIModel | undefined;
}

// Python Bridge
class PythonBridge {
  private pythonProcess: ChildProcess;
  
  async initialize(): Promise<void>;
  async execute(script: string, args: any): Promise<any>;
  async shutdown(): Promise<void>;
}

// AI Decision
interface AIDecision {
  action: string;
  confidence: number;
  reasoning: string;
  metadata: Record<string, any>;
}
```

---

## 🧪 TESTING PACKAGE (@somniaagent/testing)

### Simulator Architecture

```typescript
// Agent Simulator
class AgentSimulator {
  private agents: SomniaAgent[];
  private mockChain: MockBlockchain;
  private eventQueue: EventQueue;
  
  // Setup
  addAgent(agent: SomniaAgent): void;
  setScenario(scenario: Scenario): void;
  
  // Execution
  async simulate(options: SimulationOptions): Promise<SimulationResult>;
  
  // Analysis
  getResults(): SimulationResult;
  getMetrics(): SimulationMetrics;
}

// Mock Blockchain
class MockBlockchain {
  private blocks: Block[];
  private state: Map<string, any>;
  
  async mineBlock(): Promise<Block>;
  async executeTransaction(tx: Transaction): Promise<Receipt>;
  getState(key: string): any;
  setState(key: string, value: any): void;
}

// Scenario
interface Scenario {
  name: string;
  duration: number;
  events: MockEvent[];
  initialState: any;
}

// Simulation Result
interface SimulationResult {
  success: boolean;
  duration: number;
  events: AgentEvent[];
  actions: Action[];
  metrics: SimulationMetrics;
  errors: Error[];
}
```

---

## 🖥️ CLI PACKAGE (@somniaagent/cli)

### Command Structure

```typescript
// CLI Commands
class SomniaAgentCLI {
  // Init command
  async init(name: string, options: InitOptions): Promise<void>;
  
  // Test command
  async test(options: TestOptions): Promise<void>;
  
  // Deploy command
  async deploy(options: DeployOptions): Promise<void>;
  
  // Monitor command
  async monitor(options: MonitorOptions): Promise<void>;
  
  // Generate command
  async generate(type: string, options: GenerateOptions): Promise<void>;
}

// Init Options
interface InitOptions {
  template?: 'defi' | 'gaming' | 'custom';
  typescript?: boolean;
  git?: boolean;
}

// Deploy Options
interface DeployOptions {
  network: 'testnet' | 'mainnet';
  verify?: boolean;
  gasLimit?: number;
}
```

---

## 📊 DASHBOARD PACKAGE (@somniaagent/dashboard)

### Architecture

```
Frontend (Next.js + React)
├── pages/
│   ├── index.tsx          # Dashboard home
│   ├── agents/            # Agent list & details
│   ├── analytics/         # Analytics & metrics
│   └── settings/          # Configuration
├── components/
│   ├── AgentCard/
│   ├── MetricsChart/
│   ├── EventLog/
│   └── ActionHistory/
└── hooks/
    ├── useAgent/
    ├── useMetrics/
    └── useWebSocket/

Backend (Node.js + Express)
├── routes/
│   ├── agents.ts          # Agent CRUD
│   ├── metrics.ts         # Metrics API
│   └── events.ts          # Event stream
├── services/
│   ├── AgentService.ts
│   ├── MetricsService.ts
│   └── WebSocketService.ts
└── database/
    └── schema.sql         # PostgreSQL schema
```

---

## 🔗 SMART CONTRACTS

### Contract Architecture

```solidity
// BaseAgent.sol
contract BaseAgent {
    address public owner;
    string public name;
    AgentType public agentType;
    AgentStatus public status;
    
    event ActionExecuted(string action, bytes data, uint256 timestamp);
    event StateChanged(AgentStatus oldStatus, AgentStatus newStatus);
    
    function initialize(string memory _name, AgentType _type) external;
    function executeAction(string memory action, bytes memory data) external;
    function updateStatus(AgentStatus newStatus) external;
}

// AgentRegistry.sol
contract AgentRegistry {
    mapping(address => AgentInfo) public agents;
    address[] public agentList;
    
    event AgentRegistered(address indexed agent, string name);
    event AgentUnregistered(address indexed agent);
    
    function registerAgent(address agent, string memory name) external;
    function unregisterAgent(address agent) external;
    function getAgent(address agent) external view returns (AgentInfo memory);
    function getAllAgents() external view returns (address[] memory);
}

// AgentFactory.sol
contract AgentFactory {
    address public registry;
    
    event AgentCreated(address indexed agent, address indexed owner);
    
    function createAgent(
        string memory name,
        AgentType agentType
    ) external returns (address);
}
```

---

## 🔄 DATA FLOW

### Agent Lifecycle Flow

```
1. INITIALIZATION
   Developer → CLI (init) → Template → Project Structure
   
2. DEVELOPMENT
   Developer → Code Editor → Agent Logic → AI Model
   
3. TESTING
   Developer → CLI (test) → Simulator → Results
   
4. DEPLOYMENT
   Developer → CLI (deploy) → Smart Contract → Somnia Testnet
   
5. MONITORING
   Agent → Events → Dashboard Backend → WebSocket → Dashboard UI
   
6. EXECUTION
   Blockchain Event → Agent → AI Analysis → Decision → Action → Transaction
```

### Event Flow

```
Blockchain
  ↓ (event emission)
Event Listener (SDK)
  ↓ (event parsing)
Agent Event Handler
  ↓ (AI analysis)
AI Model
  ↓ (decision)
Agent Executor
  ↓ (transaction)
Smart Contract
  ↓ (state change)
Blockchain
```

---

## 🗄️ DATA MODELS

### Database Schema (PostgreSQL)

```sql
-- Agents table
CREATE TABLE agents (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    contract_address VARCHAR(42) NOT NULL,
    owner_address VARCHAR(42) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY,
    agent_id UUID REFERENCES agents(id),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Actions table
CREATE TABLE actions (
    id UUID PRIMARY KEY,
    agent_id UUID REFERENCES agents(id),
    action_type VARCHAR(100) NOT NULL,
    action_data JSONB,
    tx_hash VARCHAR(66),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Metrics table
CREATE TABLE metrics (
    id UUID PRIMARY KEY,
    agent_id UUID REFERENCES agents(id),
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC,
    timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 SECURITY ARCHITECTURE

### Security Layers

1. **Smart Contract Security**
   - Access control (Ownable)
   - Reentrancy guards
   - Input validation
   - Emergency pause mechanism

2. **SDK Security**
   - Private key management
   - Secure RPC connections
   - Rate limiting
   - Input sanitization

3. **Dashboard Security**
   - Authentication (JWT)
   - Authorization (RBAC)
   - HTTPS only
   - CORS configuration

---

## 📈 SCALABILITY

### Horizontal Scaling

```
Load Balancer
    ↓
┌─────────┬─────────┬─────────┐
│ API     │ API     │ API     │
│ Server 1│ Server 2│ Server 3│
└─────────┴─────────┴─────────┘
    ↓           ↓           ↓
┌─────────────────────────────┐
│   Shared Database (PG)      │
└─────────────────────────────┘
```

### Caching Strategy

- Redis for real-time metrics
- In-memory cache for frequently accessed data
- CDN for static assets

---

## 🎯 MVP ARCHITECTURE DECISIONS

### What's In MVP:

1. ✅ Core SDK with basic agent class
2. ✅ Simple AI integration (Python bridge)
3. ✅ Basic testing framework
4. ✅ CLI with init, test, deploy commands
5. ✅ Simple dashboard (read-only)
6. ✅ 3 smart contracts (BaseAgent, Registry, Factory)

### What's Post-MVP:

1. ⏳ Advanced AI models
2. ⏳ Multi-agent coordination
3. ⏳ VS Code extension
4. ⏳ Advanced analytics
5. ⏳ Mobile dashboard

---

**Next:** API Design & Technical Specifications

