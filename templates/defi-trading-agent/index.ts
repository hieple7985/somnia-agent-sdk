/**
 * DeFi Trading Agent Template
 * 
 * This template demonstrates a simple autonomous trading agent that:
 * - Monitors price changes
 * - Analyzes market conditions
 * - Executes trades based on AI decisions
 */

import { SomniaAgent } from '@somniaagent/core';

// Configuration
const config = {
  name: 'DeFiTradingAgent',
  type: 'defi' as const,
  autonomy: 'high' as const,
  triggers: ['price_change', 'liquidity_event'],
  
  // Trading parameters
  tradingParams: {
    minConfidence: 0.7,      // Minimum AI confidence to execute trade
    maxTradeSize: 1.0,       // Maximum trade size in ETH
    stopLoss: 0.05,          // 5% stop loss
    takeProfit: 0.10,        // 10% take profit
  }
};

// Create agent
const agent = new SomniaAgent({
  name: config.name,
  type: config.type,
  autonomy: config.autonomy,
  triggers: config.triggers,
});

// Initialize agent
async function init() {
  console.log('🚀 Initializing DeFi Trading Agent...');
  await agent.init();
  console.log('✅ Agent initialized');
}

// Set up event handlers
function setupEventHandlers() {
  // Handle price change events
  agent.onEvent('price_change', async (event) => {
    console.log('📊 Price change detected:', event.data);
    
    const { price, change, volume } = event.data;
    
    // Analyze market conditions using AI
    const decision = await agent.ai.analyze({
      price,
      change,
      volume,
      timestamp: event.timestamp,
    });
    
    console.log('🤖 AI Decision:', {
      action: decision.action,
      confidence: decision.confidence,
      reasoning: decision.reasoning,
    });
    
    // Execute trade if confidence is high enough
    if (decision.confidence >= config.tradingParams.minConfidence) {
      try {
        const result = await agent.execute({
          type: decision.action,
          params: {
            ...decision.params,
            maxSize: config.tradingParams.maxTradeSize,
          },
        });
        
        console.log('✅ Trade executed:', result.txHash);
      } catch (error) {
        console.error('❌ Trade failed:', (error as Error).message);
      }
    } else {
      console.log('⏸️  Confidence too low, holding position');
    }
  });
  
  // Handle liquidity events
  agent.onEvent('liquidity_event', async (event) => {
    console.log('💧 Liquidity event detected:', event.data);
    
    // Analyze liquidity impact
    const decision = await agent.ai.analyze({
      type: 'liquidity',
      data: event.data,
    });
    
    if (decision.action === 'adjust_position') {
      console.log('🔄 Adjusting position based on liquidity...');
      // Implement position adjustment logic
    }
  });
  
  // Handle agent lifecycle events
  agent.onEvent('agent:started', (event) => {
    console.log('▶️  Agent started at', new Date(event.timestamp));
  });
  
  agent.onEvent('agent:stopped', (event) => {
    console.log('⏹️  Agent stopped. Uptime:', event.data.uptime, 'ms');
  });
  
  agent.onEvent('agent:action_executed', (event) => {
    const { action, result } = event.data;
    console.log('📝 Action executed:', {
      type: action.type,
      success: result.success,
      gasUsed: result.gasUsed,
    });
  });
  
  agent.onEvent('agent:error', (event) => {
    console.error('⚠️  Agent error:', event.data.error);
  });
}

// Start agent
async function start() {
  console.log('▶️  Starting agent...');
  await agent.start();
  console.log('✅ Agent is now running');
  
  // Display current state
  const state = agent.getState();
  console.log('📊 Current state:', {
    status: state.status,
    totalActions: state.metrics.totalActions,
    successRate: (state.metrics.successRate * 100).toFixed(2) + '%',
  });
}

// Stop agent
async function stop() {
  console.log('⏹️  Stopping agent...');
  await agent.stop();
  console.log('✅ Agent stopped');
  
  // Display final metrics
  const state = agent.getState();
  console.log('📊 Final metrics:', {
    totalActions: state.metrics.totalActions,
    successRate: (state.metrics.successRate * 100).toFixed(2) + '%',
    avgGasUsed: state.metrics.avgGasUsed,
    uptime: state.metrics.uptime + 'ms',
  });
}

// Deploy agent to blockchain
async function deploy() {
  console.log('🚀 Deploying agent to Somnia testnet...');
  
  const result = await agent.deploy({
    network: 'testnet',
    gasLimit: 5000000,
  });
  
  console.log('✅ Agent deployed:', {
    contractAddress: result.contractAddress,
    txHash: result.txHash,
    blockNumber: result.blockNumber,
    network: result.network.name,
  });
  
  return result;
}

// Main function
async function main() {
  try {
    // Initialize
    await init();
    
    // Set up event handlers
    setupEventHandlers();
    
    // Deploy (optional - comment out if already deployed)
    // await deploy();
    
    // Start agent
    await start();
    
    // Keep agent running
    console.log('\n💡 Agent is running. Press Ctrl+C to stop.\n');
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Shutting down...');
      await stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error:', (error as Error).message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

// Export for testing
export { agent, init, start, stop, deploy };

