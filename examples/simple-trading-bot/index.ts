/**
 * Simple Trading Bot Example
 * 
 * Demonstrates the power of SomniaAgent SDK:
 * - Just 20 lines of code
 * - Fully autonomous trading agent
 * - AI-powered decision making
 * - Ready to deploy
 */

import { SomniaAgent } from '@somniaagent/core';

// Create agent (1 line)
const agent = new SomniaAgent({
  name: 'SimpleTradingBot',
  type: 'defi',
  autonomy: 'high',
});

// Initialize (1 line)
await agent.init();

// Add trading logic (5 lines)
agent.onEvent('price_change', async (event) => {
  const decision = await agent.ai.analyze(event.data);
  if (decision.confidence > 0.7) {
    await agent.execute({ type: decision.action, params: decision.params });
  }
});

// Start agent (1 line)
await agent.start();

// That's it! Your agent is now running autonomously on Somnia blockchain.
// Total: ~10 lines of actual code vs. 500-1000 lines without SDK

console.log('🚀 Trading bot is running!');
console.log('📊 Status:', agent.getState().status);

