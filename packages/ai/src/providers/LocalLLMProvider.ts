/**
 * Local LLM Provider
 * 
 * Supports Ollama, LM Studio, LocalAI, and any OpenAI-compatible local API
 * FREE TO RUN - No API costs!
 */

import axios from 'axios';
import { AIProvider, AIDecision, LocalLLMConfig } from '../types';

export class LocalLLMProvider implements AIProvider {
  private config: LocalLLMConfig;

  constructor(config: LocalLLMConfig) {
    this.config = {
      temperature: 0.7,
      maxTokens: 1000,
      timeout: 30000,
      systemPrompt: 'You are an AI agent assistant for blockchain operations.',
      ...config,
    };
  }

  /**
   * Analyze data and make decision
   */
  async analyze(data: any): Promise<AIDecision> {
    try {
      const prompt = this.buildPrompt(data);
      const response = await this.callLLM(prompt);
      return this.parseResponse(response);
    } catch (error) {
      console.error('Local LLM error:', error);
      // Fallback to simple rule-based decision
      return this.fallbackDecision(data);
    }
  }

  /**
   * Configure provider
   */
  configure(config: Partial<LocalLLMConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Build prompt from data
   */
  private buildPrompt(data: any): string {
    return `${this.config.systemPrompt}

Analyze the following event and provide a decision:

Event Type: ${data.type || 'unknown'}
Event Data: ${JSON.stringify(data, null, 2)}

Respond in JSON format:
{
  "action": "buy|sell|hold|execute",
  "confidence": 0.0-1.0,
  "reasoning": "explanation",
  "params": { "key": "value" }
}`;
  }

  /**
   * Call local LLM API
   */
  private async callLLM(prompt: string): Promise<string> {
    // Ollama API format
    if (this.config.endpoint.includes('11434')) {
      const response = await axios.post(
        `${this.config.endpoint}/api/generate`,
        {
          model: this.config.model,
          prompt,
          stream: false,
          options: {
            temperature: this.config.temperature,
            num_predict: this.config.maxTokens,
          },
        },
        {
          timeout: this.config.timeout,
        }
      );
      return response.data.response;
    }

    // OpenAI-compatible API (LM Studio, LocalAI, etc.)
    const response = await axios.post(
      `${this.config.endpoint}/v1/chat/completions`,
      {
        model: this.config.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      },
      {
        timeout: this.config.timeout,
      }
    );

    return response.data.choices[0].message.content;
  }

  /**
   * Parse LLM response
   */
  private parseResponse(response: string): AIDecision {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          action: parsed.action || 'hold',
          confidence: parsed.confidence || 0.5,
          reasoning: parsed.reasoning || 'No reasoning provided',
          params: parsed.params || {},
        };
      }
    } catch (error) {
      console.error('Failed to parse LLM response:', error);
    }

    // Fallback parsing
    return {
      action: 'hold',
      confidence: 0.5,
      reasoning: 'Failed to parse LLM response',
      params: {},
    };
  }

  /**
   * Fallback decision when LLM fails
   */
  private fallbackDecision(data: any): AIDecision {
    // Simple rule-based fallback
    if (data.type === 'price_change') {
      const change = data.change || 0;
      if (change > 0.05) {
        return {
          action: 'sell',
          confidence: 0.6,
          reasoning: 'Price increased >5% (fallback rule)',
          params: { amount: 1 },
        };
      } else if (change < -0.05) {
        return {
          action: 'buy',
          confidence: 0.6,
          reasoning: 'Price decreased >5% (fallback rule)',
          params: { amount: 1 },
        };
      }
    }

    return {
      action: 'hold',
      confidence: 0.5,
      reasoning: 'No clear signal (fallback)',
      params: {},
    };
  }
}

