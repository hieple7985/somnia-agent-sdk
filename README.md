# SomniaAgent SDK

> **AI Agent Development Framework for Somnia Blockchain**

Build autonomous AI agents for Somnia in minutes, not weeks. This SDK handles the blockchain complexity so you can focus on your agent's logic.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Somnia](https://img.shields.io/badge/blockchain-Somnia-purple.svg)](https://somnia.network)
[![Hackathon](https://img.shields.io/badge/hackathon-2025-green.svg)](https://dorahacks.io/hackathon/somnia-ai-global)

---

## 🚀 Quick Start

```bash
# 1. Install CLI
npm install -g @somniaagent/cli

# 2. Create your first agent
somniaagent init my-trading-bot --template defi-trading

# 3. Test it
cd my-trading-bot
somniaagent test --scenario market_volatility

# 4. Deploy to Somnia testnet
somniaagent deploy --network testnet
```

**That's it!** Your AI agent is live on Somnia blockchain. 🎉

---

## ✨ Features

### 🎯 **Rapid Development**
- Write agents in ~10-20 lines instead of 500+ lines of boilerplate
- Get from idea to testnet deployment in 10-15 minutes
- Three commands to get started: `init`, `test`, `deploy`

### 🧪 **Built-in Testing**
- Simulate blockchain events without spending gas
- Test agent behavior before deployment
- Multiple test scenarios included (market volatility, normal trading, etc.)

### 🔧 **Complete Toolkit**
- **Core SDK** - Event-driven agent framework with TypeScript support
- **CLI Tool** - Command-line interface for quick scaffolding
- **Testing Framework** - Simulation & validation tools
- **Smart Contracts** - Production-ready contracts (BaseAgent, Registry, Factory)
- **Templates** - Pre-built templates for DeFi and custom agents
- **Examples** - Working examples from simple to advanced

### 🌐 **Production Ready**
- ✅ Deployed and tested on Somnia Shannon Testnet
- ✅ Contract verification on block explorer
- ✅ Comprehensive documentation with real examples
- ✅ Full TypeScript support with type definitions
- ✅ Open source under MIT License

---

## 📦 What's Included

### Packages

- **[@somniaagent/core](packages/core)** - Core agent framework with event system
- **[@somniaagent/cli](packages/cli)** - Command-line interface for agent management
- **[@somniaagent/testing](packages/testing)** - Testing framework with blockchain simulation

### Smart Contracts

- **BaseAgent** - Base contract for all AI agents
- **AgentRegistry** - Central registry for agent discovery
- **AgentFactory** - Factory pattern for agent creation

### Templates

- **DeFi Trading Agent** - Automated trading bot with AI decision-making
- **Custom Agent** - Blank template for your own use case

### Examples

- **Simple Agent** - 10-line minimal example
- **Advanced Agent** - 250-line production-ready example

---

## 🎓 Documentation

- **[Architecture](docs/ARCHITECTURE.md)** - System design and components
- **[API Reference](docs/API.md)** - Complete API documentation
- **[Deployment Guide](docs/DEPLOYMENT.md)** - How to deploy to Somnia
- **[Deployed Contracts](docs/CONTRACTS.md)** - Live contract addresses

---

## ⚠️ Current Limitations

This is an MVP built for the Somnia AI Hackathon. Here are some known limitations:

- **Event Subscription**: Currently uses polling instead of WebSocket (WebSocket reconnection is tricky)
- **AI Integration**: Mock AI interface by default - you need to plug in your own models
- **Rate Limiting**: No built-in rate limiting - implement your own for production
- **Gas Estimation**: Basic estimation that doesn't account for network congestion
- **Testing**: Simulator doesn't model network delays or failures yet

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for full list of trade-offs and post-MVP roadmap.

---

## 🌐 Deployed Contracts

**Network:** Somnia Shannon Testnet (Chain ID: 50312)

| Contract | Address | Explorer |
|----------|---------|----------|
| **AgentRegistry** | `0xF118Ce0EC1370879D48c4d20e2654904e63c34fD` | [View](https://shannon-explorer.somnia.network/address/0xF118Ce0EC1370879D48c4d20e2654904e63c34fD) |
| **AgentFactory** | `0x9f0b44f152EdDFB99f0206D2E7E390b5ED69372b` | [View](https://shannon-explorer.somnia.network/address/0x9f0b44f152EdDFB99f0206D2E7E390b5ED69372b) |
| **Sample Agent** | `0xC51D76BaD946a13428d4425FE07F3fbc23Af603D` | [View](https://shannon-explorer.somnia.network/address/0xC51D76BaD946a13428d4425FE07F3fbc23Af603D) |

See [DEPLOYMENT.md](DEPLOYMENT.md) for full details.

---

## 💻 Usage Examples

### Create a Simple Trading Agent

```typescript
import { SomniaAgent } from '@somniaagent/core';

// Create agent with basic config
const agent = new SomniaAgent({
  name: 'MyTradingBot',
  type: 'defi',
  autonomy: 'high',
});

// Initialize connection to Somnia
await agent.init();

// Add event handler for price changes
agent.onEvent('price_change', async (event) => {
  // Use AI to analyze market data
  const decision = await agent.ai.analyze(event.data);

  // Only execute if confidence is high enough
  if (decision.confidence > 0.7) {
    await agent.execute({
      type: decision.action,
      params: decision.params
    });
  }
});

// Start listening for events
await agent.start();
```

### Test Your Agent

```bash
# Run simulation with market volatility scenario
somniaagent test --scenario market_volatility

# Output:
# 🧪 Testing AI Agent
# 📊 Test Results:
#   Total Events: 12
#   Successful Actions: 11
#   Success Rate: 91.67%
#   Avg Response Time: 250ms
# ✅ Your agent is performing well!
```

### Deploy to Somnia

```bash
# Deploy to testnet
somniaagent deploy --network testnet

# Output:
# 🚀 Deploy AI Agent to Somnia
# ✅ AgentRegistry deployed: 0x1234...
# ✅ AgentFactory deployed: 0x5678...
# ✅ Agent deployed: 0x9abc...
# ✅ Deployment Successful!
```

### Monitor Your Agent

```bash
# Real-time monitoring
somniaagent monitor 0x9abc... --network testnet

# Output:
# 📊 Monitoring AI Agent
# Status: RUNNING ✅
# Uptime: 3600s
# Total Actions: 247
# Success Rate: 89.23%
```

---

## 🛠️ Installation

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Git

### Install CLI Globally

```bash
npm install -g @somniaagent/cli
```

### Or Use in Your Project

```bash
npm install @somniaagent/core @somniaagent/cli @somniaagent/testing
```

### Development Setup

```bash
# Clone repository
git clone https://github.com/hieple7985/somniaagent-sdk.git
cd somniaagent-sdk

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Your Application                      │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  @somniaagent/cli                        │
│              (Command-line Interface)                    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  @somniaagent/core                       │
│         (Agent Framework + Event System)                 │
└─────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Testing    │  │    Smart     │  │   Somnia     │
│  Framework   │  │  Contracts   │  │  Blockchain  │
└──────────────┘  └──────────────┘  └──────────────┘
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

---

## 🎯 Use Cases

- **DeFi Trading Bots** - Automated trading with AI decision-making
- **Gaming Agents** - NPCs with autonomous behavior
- **Infrastructure Agents** - Network monitoring and optimization
- **Custom Agents** - Build your own use case

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏆 Hackathon

Built for **Somnia AI Hackathon 2025**

- **Track:** Infra Agents + Open Track
- **Team:** Hiep Le
- **Date:** November 2025

---

## 🔗 Links

- **Documentation:** [docs/](docs/)
- **Examples:** [examples/](examples/)
- **Templates:** [templates/](templates/)
- **Deployed Contracts:** [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 💬 Support

- **Issues:** [GitHub Issues](https://github.com/hieple7985/somniaagent-sdk/issues)
- **Discussions:** [GitHub Discussions](https://github.com/hieple7985/somniaagent-sdk/discussions)

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ for the Somnia ecosystem**

