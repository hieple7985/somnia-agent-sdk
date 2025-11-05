/**
 * Simple Trading Bot Example
 *
 * Demonstrates the power of SomniaAgent SDK:
 * - Just ~20 lines of code
 * - Fully autonomous trading agent
 * - AI-powered decision making
 * - Ready to deploy
 *
 * Note: This is a minimal example. For production use, add proper error handling,
 * rate limiting, and risk management (see advanced-defi-agent example).
 */

import { SomniaAgent } from '@somniaagent/core';

// Create agent with basic config
const agent = new SomniaAgent({
  name: 'SimpleTradingBot',
  type: 'defi',
  autonomy: 'high',
});

// Initialize connection to Somnia
await agent.init();

// Add trading logic
agent.onEvent('price_change', async (event) => {
  try {
    // Use AI to analyze market data
    const decision = await agent.ai.analyze(event.data);

    // Only execute if confidence is high enough
    if (decision.confidence > 0.7) {
      await agent.execute({
        type: decision.action,
        params: decision.params
      });
      console.log(`✅ Executed ${decision.action} with confidence ${decision.confidence}`);
    }
  } catch (error) {
    // In production, you'd want more sophisticated error handling
    console.error('❌ Trade failed:', error);
  }
});

// Start listening for events
await agent.start();

// That's it! Your agent is now running autonomously on Somnia blockchain.
// Total: ~15 lines of actual code vs. 500-1000 lines without SDK

console.log('🚀 Trading bot is running!');
console.log('📊 Status:', agent.getState().status);

