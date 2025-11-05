# SomniaAgent SDK - API Design

**Version:** 1.0  
**Date:** November 5, 2025  
**Status:** 🎨 Design Phase

---

## 📦 @somniaagent/core API

### SomniaAgent Class

```typescript
import { SomniaAgent, AgentConfig } from '@somniaagent/core';

// Create agent
const agent = new SomniaAgent({
  name: 'MyTradingAgent',
  type: 'defi',
  autonomy: 'high',
  triggers: ['price_change', 'liquidity_event'],
  network: 'testnet',
  aiModel: 'trading-v1'
});

// Initialize
await agent.init();

// Event handlers
agent.onEvent('price_change', async (event) => {
  const decision = await agent.ai.analyze(event.data);
  
  if (decision.confidence > 0.7) {
    await agent.execute({
      type: 'trade',
      params: decision.params
    });
  }
});

// Start agent
await agent.start();

// Get state
const state = agent.getState();
console.log(state.status); // 'running'

// Stop agent
await agent.stop();

// Deploy to blockchain
const deployment = await agent.deploy({
  network: 'testnet',
  gasLimit: 5000000
});
console.log(deployment.contractAddress);
```

### Configuration Interface

```typescript
interface AgentConfig {
  // Required
  name: string;                    // Agent name
  type: AgentType;                 // 'defi' | 'gaming' | 'custom'
  
  // Optional
  autonomy?: 'low' | 'medium' | 'high';  // Default: 'medium'
  triggers?: string[];             // Events to listen for
  network?: Network;               // Default: 'testnet'
  aiModel?: string;                // AI model to use
  rpcUrl?: string;                 // Custom RPC endpoint
  privateKey?: string;             // For signing transactions
}

type AgentType = 'defi' | 'gaming' | 'governance' | 'custom';

interface Network {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl?: string;
}
```

### State Management

```typescript
// Get state
const state = agent.getState();

interface AgentState {
  status: 'idle' | 'running' | 'paused' | 'error';
  lastAction: Action | null;
  metrics: {
    totalActions: number;
    successRate: number;
    avgGasUsed: number;
    uptime: number;
  };
  data: Record<string, any>;  // Custom state data
}

// Update state
agent.setState({
  data: {
    lastPrice: 1000,
    portfolio: { ETH: 10, USDC: 5000 }
  }
});

// Listen to state changes
agent.onEvent('state_changed', (event) => {
  console.log('State changed:', event.data);
});
```

### Action Execution

```typescript
// Execute action
const result = await agent.execute({
  type: 'trade',
  params: {
    token: 'ETH',
    amount: 1,
    side: 'buy'
  }
});

interface Action {
  type: string;
  params: Record<string, any>;
  gasLimit?: number;
  gasPrice?: string;
}

interface ExecutionResult {
  success: boolean;
  txHash: string;
  receipt: TransactionReceipt;
  gasUsed: number;
  error?: Error;
}
```

---

## 🤖 @somniaagent/ai API

### AI Interface

```typescript
import { AIModel } from '@somniaagent/ai';

// Load AI model
const model = await agent.ai.loadModel('trading-v1', {
  type: 'tensorflow',
  path: './models/trading-v1',
  config: {
    threshold: 0.7
  }
});

// Analyze data
const decision = await agent.ai.analyze({
  price: 1000,
  volume: 50000,
  trend: 'up'
});

interface AIDecision {
  action: string;              // Recommended action
  confidence: number;          // 0-1
  reasoning: string;           // Explanation
  params: Record<string, any>; // Action parameters
  metadata: {
    modelVersion: string;
    processingTime: number;
  };
}

// Predict
const prediction = await agent.ai.predict({
  features: [1000, 50000, 1.5]
});

interface Prediction {
  value: number;
  confidence: number;
  timestamp: number;
}
```

### Custom AI Model

```python
# Python AI Model
from somniaagent import AIModel

class TradingModel(AIModel):
    def __init__(self):
        super().__init__()
        self.model = self.load_model('trading-v1.h5')
    
    def analyze(self, data):
        """Analyze market data and return decision"""
        features = self.extract_features(data)
        prediction = self.model.predict(features)
        
        return {
            'action': 'buy' if prediction > 0.7 else 'hold',
            'confidence': float(prediction),
            'reasoning': f'Model prediction: {prediction}',
            'params': {
                'amount': self.calculate_amount(prediction)
            }
        }
    
    def extract_features(self, data):
        """Extract features from raw data"""
        return [
            data['price'],
            data['volume'],
            data.get('trend', 0)
        ]
```

---

## 🧪 @somniaagent/testing API

### Agent Simulator

```typescript
import { AgentSimulator } from '@somniaagent/testing';

// Create simulator
const simulator = new AgentSimulator();

// Add agent
simulator.addAgent(myAgent);

// Set scenario
simulator.setScenario({
  name: 'market_crash',
  duration: 86400000, // 24 hours in ms
  events: [
    {
      type: 'price_change',
      timestamp: 1000,
      data: { price: 1000, change: -0.1 }
    },
    {
      type: 'price_change',
      timestamp: 5000,
      data: { price: 900, change: -0.1 }
    }
  ],
  initialState: {
    balance: 10000,
    portfolio: {}
  }
});

// Run simulation
const result = await simulator.simulate({
  speed: 10,        // 10x speed
  verbose: true     // Log events
});

// Analyze results
console.log(result.metrics);

interface SimulationResult {
  success: boolean;
  duration: number;
  events: AgentEvent[];
  actions: Action[];
  metrics: {
    totalActions: number;
    successfulActions: number;
    failedActions: number;
    avgResponseTime: number;
    finalState: any;
  };
  errors: Error[];
}
```

### Mock Events

```typescript
import { mockEvent, mockPriceChange } from '@somniaagent/testing';

// Create mock event
const event = mockEvent({
  type: 'price_change',
  data: { price: 1000 }
});

// Emit to agent
agent.emit('price_change', event);

// Built-in mocks
const priceEvent = mockPriceChange(1000, -0.05);
const liquidityEvent = mockLiquidityEvent(50000);
const tradeEvent = mockTradeEvent('buy', 1, 1000);
```

---

## 🖥️ @somniaagent/cli API

### CLI Commands

```bash
# Initialize new agent project
somniaagent init my-trading-agent --template defi

# Options
somniaagent init <name> [options]
  --template, -t    Template to use (defi|gaming|custom)
  --typescript      Use TypeScript (default: true)
  --git             Initialize git repository (default: true)
  --install         Install dependencies (default: true)

# Test agent
somniaagent test --scenario market_volatility

# Options
somniaagent test [options]
  --scenario, -s    Scenario to run
  --duration, -d    Simulation duration (ms)
  --speed           Simulation speed multiplier
  --verbose, -v     Verbose output

# Deploy agent
somniaagent deploy --network testnet

# Options
somniaagent deploy [options]
  --network, -n     Network (testnet|mainnet)
  --verify          Verify contract on explorer
  --gas-limit       Gas limit for deployment
  --private-key     Private key (or use .env)

# Monitor agent
somniaagent monitor

# Options
somniaagent monitor [options]
  --agent, -a       Agent contract address
  --interval, -i    Polling interval (ms)
  --dashboard       Open web dashboard

# Generate code
somniaagent generate model --name TradingModel

# Options
somniaagent generate <type> [options]
  type: model|template|test
  --name, -n        Name of generated item
  --output, -o      Output directory
```

---

## 📊 Dashboard API (REST + WebSocket)

### REST API Endpoints

```typescript
// GET /api/agents
// List all agents
GET /api/agents
Response: {
  agents: [
    {
      id: 'uuid',
      name: 'MyTradingAgent',
      type: 'defi',
      status: 'running',
      contractAddress: '0x...',
      createdAt: '2025-11-05T00:00:00Z'
    }
  ]
}

// GET /api/agents/:id
// Get agent details
GET /api/agents/uuid
Response: {
  id: 'uuid',
  name: 'MyTradingAgent',
  type: 'defi',
  status: 'running',
  contractAddress: '0x...',
  state: { ... },
  metrics: { ... },
  createdAt: '2025-11-05T00:00:00Z'
}

// GET /api/agents/:id/events
// Get agent events
GET /api/agents/uuid/events?limit=100&offset=0
Response: {
  events: [
    {
      id: 'uuid',
      type: 'price_change',
      data: { price: 1000 },
      timestamp: '2025-11-05T00:00:00Z'
    }
  ],
  total: 1000,
  limit: 100,
  offset: 0
}

// GET /api/agents/:id/actions
// Get agent actions
GET /api/agents/uuid/actions?limit=100&offset=0
Response: {
  actions: [
    {
      id: 'uuid',
      type: 'trade',
      params: { ... },
      txHash: '0x...',
      status: 'success',
      createdAt: '2025-11-05T00:00:00Z'
    }
  ],
  total: 500,
  limit: 100,
  offset: 0
}

// GET /api/agents/:id/metrics
// Get agent metrics
GET /api/agents/uuid/metrics?period=24h
Response: {
  metrics: {
    totalActions: 100,
    successRate: 0.95,
    avgGasUsed: 50000,
    uptime: 86400000
  },
  timeseries: [
    { timestamp: '2025-11-05T00:00:00Z', value: 100 }
  ]
}
```

### WebSocket API

```typescript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:3000/ws');

// Subscribe to agent events
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'agent:uuid:events'
}));

// Receive real-time events
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Event:', data);
};

// Message format
interface WSMessage {
  type: 'subscribe' | 'unsubscribe' | 'event' | 'action' | 'metric';
  channel: string;
  data?: any;
}

// Channels
// - agent:{id}:events    - Agent events
// - agent:{id}:actions   - Agent actions
// - agent:{id}:metrics   - Agent metrics
// - agent:{id}:state     - Agent state changes
```

---

## 🔗 Smart Contract API

### BaseAgent Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBaseAgent {
    // Events
    event ActionExecuted(
        string indexed actionType,
        bytes data,
        uint256 timestamp
    );
    
    event StateChanged(
        AgentStatus oldStatus,
        AgentStatus newStatus
    );
    
    // Functions
    function initialize(
        string memory _name,
        AgentType _type
    ) external;
    
    function executeAction(
        string memory actionType,
        bytes memory data
    ) external returns (bool);
    
    function updateStatus(
        AgentStatus newStatus
    ) external;
    
    function getInfo() external view returns (
        string memory name,
        AgentType agentType,
        AgentStatus status,
        address owner
    );
}

enum AgentType { DEFI, GAMING, GOVERNANCE, CUSTOM }
enum AgentStatus { IDLE, RUNNING, PAUSED, ERROR }
```

### AgentRegistry Contract

```solidity
interface IAgentRegistry {
    // Events
    event AgentRegistered(
        address indexed agent,
        string name,
        address indexed owner
    );
    
    event AgentUnregistered(
        address indexed agent
    );
    
    // Functions
    function registerAgent(
        address agent,
        string memory name
    ) external;
    
    function unregisterAgent(
        address agent
    ) external;
    
    function getAgent(
        address agent
    ) external view returns (AgentInfo memory);
    
    function getAllAgents() external view returns (address[] memory);
    
    function getAgentsByOwner(
        address owner
    ) external view returns (address[] memory);
}

struct AgentInfo {
    string name;
    AgentType agentType;
    AgentStatus status;
    address owner;
    uint256 createdAt;
}
```

---

## 📝 Usage Examples

### Example 1: Simple DeFi Trading Agent

```typescript
import { SomniaAgent } from '@somniaagent/core';

const agent = new SomniaAgent({
  name: 'SimpleTradingBot',
  type: 'defi',
  autonomy: 'high'
});

await agent.init();

agent.onEvent('price_change', async (event) => {
  const { price, change } = event.data;
  
  // Simple strategy: buy on dip, sell on pump
  if (change < -0.05) {
    await agent.execute({
      type: 'buy',
      params: { amount: 1, price }
    });
  } else if (change > 0.05) {
    await agent.execute({
      type: 'sell',
      params: { amount: 1, price }
    });
  }
});

await agent.start();
```

### Example 2: AI-Powered Gaming Agent

```typescript
import { SomniaAgent } from '@somniaagent/core';

const agent = new SomniaAgent({
  name: 'SmartNPC',
  type: 'gaming',
  aiModel: 'npc-behavior-v1'
});

await agent.init();

agent.onEvent('player_interaction', async (event) => {
  const decision = await agent.ai.analyze({
    playerAction: event.data.action,
    gameState: agent.getState().data.gameState
  });
  
  await agent.execute({
    type: 'npc_action',
    params: decision.params
  });
});

await agent.start();
```

---

**Next:** Technology Stack & Development Setup

