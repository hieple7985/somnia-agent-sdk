/**
 * AI Provider Types
 */

export interface AIDecision {
  action: string;
  confidence: number;
  reasoning: string;
  params: Record<string, any>;
}

export interface AIProviderConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AIProvider {
  analyze(data: any): Promise<AIDecision>;
  configure(config: Partial<AIProviderConfig>): void;
}

export interface LocalLLMConfig extends AIProviderConfig {
  endpoint: string;
  timeout?: number;
}

export interface OpenAIConfig extends AIProviderConfig {
  apiKey: string;
  organization?: string;
}

export interface MockAIConfig {
  defaultAction: string;
  defaultConfidence: number;
  randomize?: boolean;
}

