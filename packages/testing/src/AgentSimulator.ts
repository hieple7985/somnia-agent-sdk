/**
 * Agent Simulator
 * 
 * Simulates blockchain events and agent behavior for testing
 */

import EventEmitter from 'eventemitter3';
import { SomniaAgent, Action } from '@somniaagent/core';

export interface SimulationConfig {
  duration?: number; // Duration in milliseconds
  eventInterval?: number; // Interval between events in ms
  scenario?: string; // Predefined scenario
  verbose?: boolean; // Verbose logging
}

export interface SimulationEvent {
  type: string;
  data: any;
  timestamp: number;
}

export interface SimulationResult {
  totalEvents: number;
  totalActions: number;
  successfulActions: number;
  failedActions: number;
  successRate: number;
  avgResponseTime: number;
  avgGasUsed: number;
  duration: number;
  events: SimulationEvent[];
  actions: Action[];
}

export class AgentSimulator {
  private agent: SomniaAgent;
  private eventEmitter: EventEmitter;
  private config: SimulationConfig;
  private isRunning: boolean = false;
  private events: SimulationEvent[] = [];
  private actions: Action[] = [];
  private startTime: number = 0;

  constructor(agent: SomniaAgent, config: SimulationConfig = {}) {
    this.agent = agent;
    this.eventEmitter = new EventEmitter();
    this.config = {
      duration: 60000, // 1 minute default
      eventInterval: 5000, // 5 seconds default
      scenario: 'normal_trading',
      verbose: false,
      ...config,
    };
  }

  /**
   * Run simulation
   */
  async run(): Promise<SimulationResult> {
    this.isRunning = true;
    this.startTime = Date.now();
    this.events = [];
    this.actions = [];

    if (this.config.verbose) {
      console.log('🧪 Starting simulation...');
      console.log('📋 Scenario:', this.config.scenario);
      console.log('⏱️  Duration:', this.config.duration + 'ms');
    }

    // Get scenario events
    const scenarioEvents = this.getScenarioEvents(this.config.scenario!);

    // Emit events
    for (const event of scenarioEvents) {
      if (!this.isRunning) break;

      await this.emitEvent(event);
      await this.sleep(this.config.eventInterval!);
    }

    // Calculate results
    const duration = Date.now() - this.startTime;
    const result = this.calculateResults(duration);

    if (this.config.verbose) {
      console.log('\n✅ Simulation complete!');
      console.log('📊 Results:', result);
    }

    this.isRunning = false;
    return result;
  }

  /**
   * Stop simulation
   */
  stop(): void {
    this.isRunning = false;
  }

  /**
   * Emit a simulation event
   */
  private async emitEvent(event: SimulationEvent): Promise<void> {
    this.events.push(event);

    if (this.config.verbose) {
      console.log(`\n📡 Event: ${event.type}`, event.data);
    }

    // Trigger agent event handler
    this.eventEmitter.emit(event.type, {
      type: event.type,
      data: event.data,
      timestamp: event.timestamp,
    });

    // Simulate agent processing
    await this.simulateAgentAction(event);
  }

  /**
   * Simulate agent action in response to event
   */
  private async simulateAgentAction(event: SimulationEvent): Promise<void> {
    // Simulate AI decision time
    await this.sleep(100 + Math.random() * 200);

    // Simulate action execution (90% success rate)
    const success = Math.random() > 0.1;

    const action: Action = {
      type: success ? 'buy' : 'sell',
      params: {
        amount: Math.random() * 10,
        price: event.data.price || 1000,
      },
      gasLimit: 50000,
      timestamp: Date.now(),
    };

    this.actions.push(action);

    if (this.config.verbose) {
      const status = success ? '✅' : '❌';
      console.log(`  ${status} Action: ${action.type}`, action.params);
    }
  }

  /**
   * Get predefined scenario events
   */
  private getScenarioEvents(scenario: string): SimulationEvent[] {
    const scenarios: Record<string, SimulationEvent[]> = {
      normal_trading: [
        {
          type: 'price_change',
          data: { price: 1000, change: 0.01, volume: 30000 },
          timestamp: Date.now(),
        },
        {
          type: 'price_change',
          data: { price: 1010, change: -0.005, volume: 28000 },
          timestamp: Date.now() + 5000,
        },
        {
          type: 'price_change',
          data: { price: 1005, change: 0.008, volume: 32000 },
          timestamp: Date.now() + 10000,
        },
      ],
      market_volatility: [
        {
          type: 'price_change',
          data: { price: 1000, change: 0.05, volume: 50000 },
          timestamp: Date.now(),
        },
        {
          type: 'price_change',
          data: { price: 1050, change: -0.08, volume: 75000 },
          timestamp: Date.now() + 3000,
        },
        {
          type: 'price_change',
          data: { price: 966, change: 0.12, volume: 100000 },
          timestamp: Date.now() + 6000,
        },
        {
          type: 'price_change',
          data: { price: 1082, change: -0.05, volume: 60000 },
          timestamp: Date.now() + 9000,
        },
      ],
      liquidity_crisis: [
        {
          type: 'liquidity_event',
          data: { pool: 'ETH-USDC', liquidity: 1000000, change: -0.3 },
          timestamp: Date.now(),
        },
        {
          type: 'price_change',
          data: { price: 1000, change: -0.15, volume: 20000 },
          timestamp: Date.now() + 2000,
        },
        {
          type: 'liquidity_event',
          data: { pool: 'ETH-USDC', liquidity: 700000, change: -0.2 },
          timestamp: Date.now() + 4000,
        },
      ],
      bull_run: [
        {
          type: 'price_change',
          data: { price: 1000, change: 0.05, volume: 50000 },
          timestamp: Date.now(),
        },
        {
          type: 'price_change',
          data: { price: 1050, change: 0.08, volume: 75000 },
          timestamp: Date.now() + 4000,
        },
        {
          type: 'price_change',
          data: { price: 1134, change: 0.10, volume: 100000 },
          timestamp: Date.now() + 8000,
        },
        {
          type: 'price_change',
          data: { price: 1247, change: 0.07, volume: 90000 },
          timestamp: Date.now() + 12000,
        },
      ],
    };

    return scenarios[scenario] || scenarios.normal_trading;
  }

  /**
   * Calculate simulation results
   */
  private calculateResults(duration: number): SimulationResult {
    const totalEvents = this.events.length;
    const totalActions = this.actions.length;
    const successfulActions = Math.floor(totalActions * 0.9); // 90% success rate
    const failedActions = totalActions - successfulActions;
    const successRate = totalActions > 0 ? successfulActions / totalActions : 0;
    const avgResponseTime = 150 + Math.random() * 100; // 150-250ms
    const avgGasUsed = 40000 + Math.random() * 10000; // 40k-50k

    return {
      totalEvents,
      totalActions,
      successfulActions,
      failedActions,
      successRate,
      avgResponseTime,
      avgGasUsed,
      duration,
      events: this.events,
      actions: this.actions,
    };
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get event emitter for custom event handling
   */
  getEventEmitter(): EventEmitter {
    return this.eventEmitter;
  }
}

