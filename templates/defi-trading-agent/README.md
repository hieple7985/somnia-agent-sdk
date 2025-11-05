# DeFi Trading Agent Template

A ready-to-use template for building autonomous DeFi trading agents on Somnia blockchain.

## 🎯 What This Template Does

This agent automatically:
- 📊 Monitors price changes in real-time
- 🤖 Analyzes market conditions using AI
- 💰 Executes trades based on AI decisions
- 📈 Manages risk with stop-loss and take-profit
- 📝 Logs all actions and metrics

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file:

```env
PRIVATE_KEY=your_private_key_here
SOMNIA_TESTNET_RPC=https://testnet.somnia.network/rpc
```

### 3. Customize Trading Parameters

Edit `index.ts` to adjust trading parameters:

```typescript
const config = {
  tradingParams: {
    minConfidence: 0.7,      // Minimum AI confidence (0-1)
    maxTradeSize: 1.0,       // Maximum trade size in ETH
    stopLoss: 0.05,          // 5% stop loss
    takeProfit: 0.10,        // 10% take profit
  }
};
```

### 4. Run the Agent

```bash
npm start
```

## 📋 Features

### Event Handlers

The agent listens to these events:

- **price_change** - Triggered when token price changes
- **liquidity_event** - Triggered on liquidity pool changes

### AI Decision Making

The agent uses AI to analyze:
- Current price
- Price change percentage
- Trading volume
- Market trends

### Risk Management

Built-in risk management:
- Minimum confidence threshold
- Maximum trade size limits
- Stop-loss protection
- Take-profit targets

## 🎨 Customization

### Add Custom Events

```typescript
agent.onEvent('your_custom_event', async (event) => {
  // Your logic here
});
```

### Modify Trading Strategy

```typescript
agent.onEvent('price_change', async (event) => {
  const { price, change } = event.data;
  
  // Your custom strategy
  if (change < -0.05) {
    // Buy the dip
    await agent.execute({
      type: 'buy',
      params: { amount: 1, price }
    });
  }
});
```

### Use Custom AI Model

```typescript
import { MyCustomAI } from './my-ai-model';

agent.setAI(new MyCustomAI());
```

## 📊 Monitoring

The agent logs:
- ✅ Successful trades
- ❌ Failed trades
- 📊 Current state and metrics
- 🤖 AI decisions and reasoning

Example output:

```
🚀 Initializing DeFi Trading Agent...
✅ Agent initialized
▶️  Starting agent...
✅ Agent is now running
📊 Current state: { status: 'running', totalActions: 0, successRate: '100.00%' }

📊 Price change detected: { price: 1000, change: -0.05, volume: 50000 }
🤖 AI Decision: { action: 'buy', confidence: 0.85, reasoning: 'Strong buy signal' }
✅ Trade executed: 0x1234...
```

## 🧪 Testing

Test your agent before deploying:

```bash
# Run with simulation
somniaagent test --scenario market_volatility

# Run unit tests
npm test
```

## 🚀 Deployment

Deploy to Somnia testnet:

```bash
somniaagent deploy --network testnet
```

Or use the built-in deploy function:

```typescript
const result = await deploy();
console.log('Contract address:', result.contractAddress);
```

## 📚 Learn More

- [SomniaAgent SDK Documentation](../../README.md)
- [API Reference](../../../2_design/des_2_api_design.md)
- [Architecture Design](../../../2_design/des_1_architecture.md)

## 🤝 Contributing

Feel free to customize this template for your needs!

## 📄 License

MIT

