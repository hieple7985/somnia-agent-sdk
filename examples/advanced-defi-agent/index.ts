/**
 * Advanced DeFi Agent Example
 *
 * This example shows a more realistic trading agent with:
 * - Multi-strategy approach (mean reversion + momentum)
 * - Portfolio management with position tracking
 * - Risk management (2% risk per trade)
 * - Performance metrics tracking
 * - Custom AI integration layer
 *
 * Note: This is still a simplified example. For production trading:
 * - Add proper slippage protection
 * - Implement circuit breakers for extreme volatility
 * - Add position size limits
 * - Use proper order types (limit orders, not just market)
 * - Add comprehensive logging and monitoring
 */

import { SomniaAgent, AgentState } from '@somniaagent/core';

// Portfolio state interface
interface Portfolio {
  ETH: number;
  USDC: number;
  totalValue: number;
  positions: Position[];
}

interface Position {
  token: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;  // Profit and Loss
}

// Trading strategy implementation
class TradingStrategy {
  private portfolio: Portfolio = {
    ETH: 0,
    USDC: 10000, // Start with 10k USDC for testing
    totalValue: 10000,
    positions: [],
  };

  // Mean reversion strategy
  // Buys when price is below average, sells when above
  async meanReversion(price: number, avgPrice: number): Promise<string> {
    const deviation = (price - avgPrice) / avgPrice;

    // Using 5% threshold - adjust based on your risk tolerance
    if (deviation < -0.05) {
      return 'buy'; // Price is 5% below average - potential bounce
    } else if (deviation > 0.05) {
      return 'sell'; // Price is 5% above average - potential correction
    }

    return 'hold';
  }

  // Momentum strategy
  async momentum(priceHistory: number[]): Promise<string> {
    if (priceHistory.length < 3) return 'hold';
    
    const recentTrend = priceHistory.slice(-3);
    const isUptrend = recentTrend.every((price, i) => 
      i === 0 || price > recentTrend[i - 1]
    );
    const isDowntrend = recentTrend.every((price, i) => 
      i === 0 || price < recentTrend[i - 1]
    );
    
    if (isUptrend) return 'buy';
    if (isDowntrend) return 'sell';
    
    return 'hold';
  }

  // Calculate position size based on risk
  calculatePositionSize(
    balance: number,
    riskPercent: number,
    stopLoss: number
  ): number {
    const riskAmount = balance * riskPercent;
    return riskAmount / stopLoss;
  }

  // Update portfolio
  updatePortfolio(action: string, amount: number, price: number): void {
    if (action === 'buy') {
      const cost = amount * price;
      if (cost <= this.portfolio.USDC) {
        this.portfolio.ETH += amount;
        this.portfolio.USDC -= cost;
        this.portfolio.positions.push({
          token: 'ETH',
          amount,
          entryPrice: price,
          currentPrice: price,
          pnl: 0,
        });
      }
    } else if (action === 'sell') {
      if (amount <= this.portfolio.ETH) {
        const revenue = amount * price;
        this.portfolio.ETH -= amount;
        this.portfolio.USDC += revenue;
        
        // Update positions
        this.portfolio.positions = this.portfolio.positions.filter(
          pos => pos.amount > 0
        );
      }
    }
    
    this.portfolio.totalValue = 
      this.portfolio.USDC + (this.portfolio.ETH * price);
  }

  getPortfolio(): Portfolio {
    return { ...this.portfolio };
  }
}

// Create agent
const agent = new SomniaAgent({
  name: 'AdvancedDeFiAgent',
  type: 'defi',
  autonomy: 'high',
  triggers: ['price_change', 'liquidity_event', 'market_update'],
});

// Initialize strategy
const strategy = new TradingStrategy();

// Price history for momentum
const priceHistory: number[] = [];
const MAX_HISTORY = 20;

// Initialize agent
async function init() {
  console.log('🚀 Initializing Advanced DeFi Agent...');
  await agent.init();
  
  // Set initial state
  agent.setState({
    data: {
      portfolio: strategy.getPortfolio(),
      priceHistory: [],
      avgPrice: 0,
    },
  });
  
  console.log('✅ Agent initialized');
}

// Set up event handlers
function setupEventHandlers() {
  // Price change event
  agent.onEvent('price_change', async (event) => {
    const { price, change, volume } = event.data;
    
    console.log(`\n📊 Price: $${price} (${(change * 100).toFixed(2)}%)`);
    
    // Update price history
    priceHistory.push(price);
    if (priceHistory.length > MAX_HISTORY) {
      priceHistory.shift();
    }
    
    // Calculate average price
    const avgPrice = priceHistory.reduce((a, b) => a + b, 0) / priceHistory.length;
    
    // Get strategy signals
    const meanRevSignal = await strategy.meanReversion(price, avgPrice);
    const momentumSignal = await strategy.momentum(priceHistory);
    
    console.log('📈 Signals:', {
      meanReversion: meanRevSignal,
      momentum: momentumSignal,
    });
    
    // Combine strategies (both must agree)
    let action = 'hold';
    if (meanRevSignal === momentumSignal && meanRevSignal !== 'hold') {
      action = meanRevSignal;
    }
    
    // Use AI for final decision
    const aiDecision = await agent.ai.analyze({
      price,
      change,
      volume,
      avgPrice,
      priceHistory,
      signals: { meanRevSignal, momentumSignal },
    });
    
    console.log('🤖 AI Decision:', {
      action: aiDecision.action,
      confidence: aiDecision.confidence,
      reasoning: aiDecision.reasoning,
    });
    
    // Execute if AI agrees and confidence is high
    if (
      aiDecision.action === action &&
      aiDecision.confidence > 0.75 &&
      action !== 'hold'
    ) {
      // Calculate position size (risk 2% per trade)
      const portfolio = strategy.getPortfolio();
      const positionSize = strategy.calculatePositionSize(
        portfolio.totalValue,
        0.02, // 2% risk
        price * 0.05 // 5% stop loss
      );
      
      console.log(`💰 Executing ${action} order: ${positionSize.toFixed(4)} ETH`);
      
      try {
        const result = await agent.execute({
          type: action,
          params: {
            token: 'ETH',
            amount: positionSize,
            price,
          },
        });
        
        // Update portfolio
        strategy.updatePortfolio(action, positionSize, price);
        
        // Update agent state
        agent.setState({
          data: {
            portfolio: strategy.getPortfolio(),
            priceHistory,
            avgPrice,
          },
        });
        
        console.log('✅ Trade executed:', result.txHash);
        console.log('💼 Portfolio:', strategy.getPortfolio());
        
      } catch (error) {
        console.error('❌ Trade failed:', (error as Error).message);
      }
    } else {
      console.log('⏸️  Holding position');
    }
  });
  
  // State change event
  agent.onEvent('agent:state_changed', (event) => {
    const { newState } = event.data;
    if (newState.data.portfolio) {
      const portfolio = newState.data.portfolio;
      const pnl = portfolio.totalValue - 10000;
      const pnlPercent = (pnl / 10000) * 100;
      
      console.log(`\n💼 Portfolio Update:`);
      console.log(`   Total Value: $${portfolio.totalValue.toFixed(2)}`);
      console.log(`   P&L: $${pnl.toFixed(2)} (${pnlPercent.toFixed(2)}%)`);
      console.log(`   ETH: ${portfolio.ETH.toFixed(4)}`);
      console.log(`   USDC: $${portfolio.USDC.toFixed(2)}`);
    }
  });
  
  // Action executed event
  agent.onEvent('agent:action_executed', (event) => {
    const { action, result } = event.data;
    const state = agent.getState();
    
    console.log(`\n📊 Performance Metrics:`);
    console.log(`   Total Actions: ${state.metrics.totalActions}`);
    console.log(`   Success Rate: ${(state.metrics.successRate * 100).toFixed(2)}%`);
    console.log(`   Avg Gas Used: ${state.metrics.avgGasUsed.toFixed(0)}`);
  });
}

// Main function
async function main() {
  try {
    await init();
    setupEventHandlers();
    
    await agent.start();
    
    console.log('\n✅ Advanced DeFi Agent is running!');
    console.log('💡 Using multi-strategy approach:');
    console.log('   - Mean Reversion');
    console.log('   - Momentum');
    console.log('   - AI Decision Layer');
    console.log('   - Risk Management (2% per trade)');
    console.log('\n📊 Starting Portfolio: $10,000 USDC');
    console.log('\n💡 Press Ctrl+C to stop.\n');
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Shutting down...');
      await agent.stop();
      
      const finalPortfolio = strategy.getPortfolio();
      const finalPnL = finalPortfolio.totalValue - 10000;
      
      console.log('\n📊 Final Results:');
      console.log(`   Starting Value: $10,000`);
      console.log(`   Final Value: $${finalPortfolio.totalValue.toFixed(2)}`);
      console.log(`   P&L: $${finalPnL.toFixed(2)} (${((finalPnL / 10000) * 100).toFixed(2)}%)`);
      
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error:', (error as Error).message);
    process.exit(1);
  }
}

// Run
if (require.main === module) {
  main();
}

export { agent, strategy };

