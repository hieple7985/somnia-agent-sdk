/**
 * Testing Utilities
 * 
 * Helper functions for testing agents
 */

import { SimulationEvent } from './AgentSimulator';

/**
 * Generate random price change event
 */
export function generatePriceChangeEvent(basePrice: number = 1000): SimulationEvent {
  const change = (Math.random() - 0.5) * 0.2; // -10% to +10%
  const price = basePrice * (1 + change);
  const volume = 10000 + Math.random() * 90000;

  return {
    type: 'price_change',
    data: {
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 10000) / 10000,
      volume: Math.round(volume),
    },
    timestamp: Date.now(),
  };
}

/**
 * Generate random liquidity event
 */
export function generateLiquidityEvent(baseLiquidity: number = 1000000): SimulationEvent {
  const change = (Math.random() - 0.5) * 0.4; // -20% to +20%
  const liquidity = baseLiquidity * (1 + change);

  return {
    type: 'liquidity_event',
    data: {
      pool: 'ETH-USDC',
      liquidity: Math.round(liquidity),
      change: Math.round(change * 10000) / 10000,
    },
    timestamp: Date.now(),
  };
}

/**
 * Generate sequence of events
 */
export function generateEventSequence(
  count: number,
  eventType: 'price_change' | 'liquidity_event' = 'price_change'
): SimulationEvent[] {
  const events: SimulationEvent[] = [];
  let baseValue = eventType === 'price_change' ? 1000 : 1000000;

  for (let i = 0; i < count; i++) {
    const event =
      eventType === 'price_change'
        ? generatePriceChangeEvent(baseValue)
        : generateLiquidityEvent(baseValue);

    events.push(event);

    // Update base value for next event
    if (eventType === 'price_change') {
      baseValue = event.data.price;
    } else {
      baseValue = event.data.liquidity;
    }
  }

  return events;
}

/**
 * Create market volatility scenario
 */
export function createVolatilityScenario(duration: number = 60000): SimulationEvent[] {
  const events: SimulationEvent[] = [];
  const eventCount = Math.floor(duration / 5000); // Event every 5 seconds
  let price = 1000;

  for (let i = 0; i < eventCount; i++) {
    // High volatility: -15% to +15%
    const change = (Math.random() - 0.5) * 0.3;
    price = price * (1 + change);

    events.push({
      type: 'price_change',
      data: {
        price: Math.round(price * 100) / 100,
        change: Math.round(change * 10000) / 10000,
        volume: 50000 + Math.random() * 100000,
      },
      timestamp: Date.now() + i * 5000,
    });
  }

  return events;
}

/**
 * Create bull run scenario
 */
export function createBullRunScenario(duration: number = 60000): SimulationEvent[] {
  const events: SimulationEvent[] = [];
  const eventCount = Math.floor(duration / 5000);
  let price = 1000;

  for (let i = 0; i < eventCount; i++) {
    // Mostly positive: 0% to +10%
    const change = Math.random() * 0.1;
    price = price * (1 + change);

    events.push({
      type: 'price_change',
      data: {
        price: Math.round(price * 100) / 100,
        change: Math.round(change * 10000) / 10000,
        volume: 30000 + Math.random() * 70000,
      },
      timestamp: Date.now() + i * 5000,
    });
  }

  return events;
}

/**
 * Create bear market scenario
 */
export function createBearMarketScenario(duration: number = 60000): SimulationEvent[] {
  const events: SimulationEvent[] = [];
  const eventCount = Math.floor(duration / 5000);
  let price = 1000;

  for (let i = 0; i < eventCount; i++) {
    // Mostly negative: -10% to 0%
    const change = -Math.random() * 0.1;
    price = price * (1 + change);

    events.push({
      type: 'price_change',
      data: {
        price: Math.round(price * 100) / 100,
        change: Math.round(change * 10000) / 10000,
        volume: 20000 + Math.random() * 50000,
      },
      timestamp: Date.now() + i * 5000,
    });
  }

  return events;
}

/**
 * Assert simulation results
 */
export function assertSimulationResults(
  result: any,
  expectations: {
    minSuccessRate?: number;
    maxResponseTime?: number;
    maxGasUsed?: number;
  }
): void {
  if (expectations.minSuccessRate !== undefined) {
    if (result.successRate < expectations.minSuccessRate) {
      throw new Error(
        `Success rate ${result.successRate} is below minimum ${expectations.minSuccessRate}`
      );
    }
  }

  if (expectations.maxResponseTime !== undefined) {
    if (result.avgResponseTime > expectations.maxResponseTime) {
      throw new Error(
        `Response time ${result.avgResponseTime}ms exceeds maximum ${expectations.maxResponseTime}ms`
      );
    }
  }

  if (expectations.maxGasUsed !== undefined) {
    if (result.avgGasUsed > expectations.maxGasUsed) {
      throw new Error(
        `Gas used ${result.avgGasUsed} exceeds maximum ${expectations.maxGasUsed}`
      );
    }
  }
}

/**
 * Wait for condition
 */
export async function waitFor(
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition');
    }
    await sleep(interval);
  }
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

