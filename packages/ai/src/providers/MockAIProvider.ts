/**
 * Mock AI Provider
 * 
 * For testing without AI costs
 */

import { AIProvider, AIDecision, MockAIConfig } from '../types';

export class MockAIProvider implements AIProvider {
  private config: MockAIConfig;

  constructor(config: MockAIConfig) {
    this.config = {
      randomize: false,
      ...config,
    };
  }

  async analyze(data: any): Promise<AIDecision> {
    if (this.config.randomize) {
      return this.randomDecision();
    }

    return {
      action: this.config.defaultAction,
      confidence: this.config.defaultConfidence,
      reasoning: 'Mock AI decision for testing',
      params: {},
    };
  }

  configure(config: Partial<MockAIConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private randomDecision(): AIDecision {
    const actions = ['buy', 'sell', 'hold'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const confidence = 0.5 + Math.random() * 0.5;

    return {
      action,
      confidence,
      reasoning: `Random decision for testing (${action})`,
      params: {},
    };
  }
}

