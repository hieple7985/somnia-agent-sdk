/**
 * OpenAI Provider
 * 
 * Cloud-based AI using OpenAI's GPT models
 */

import axios from 'axios';
import { AIProvider, AIDecision, OpenAIConfig } from '../types';

export class OpenAIProvider implements AIProvider {
  private config: OpenAIConfig;

  constructor(config: OpenAIConfig) {
    this.config = {
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: 'You are an AI agent assistant for blockchain operations.',
      ...config,
    };
  }

  async analyze(data: any): Promise<AIDecision> {
    const prompt = this.buildPrompt(data);
    const response = await this.callOpenAI(prompt);
    return this.parseResponse(response);
  }

  configure(config: Partial<OpenAIConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private buildPrompt(data: any): string {
    return `Analyze the following event and provide a decision:

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

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: this.config.systemPrompt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  }

  private parseResponse(response: string): AIDecision {
    try {
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
      console.error('Failed to parse OpenAI response:', error);
    }

    return {
      action: 'hold',
      confidence: 0.5,
      reasoning: 'Failed to parse response',
      params: {},
    };
  }
}

