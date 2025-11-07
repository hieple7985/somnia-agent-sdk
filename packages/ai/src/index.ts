/**
 * @somniaagent/ai
 * 
 * AI/ML Integration Layer for SomniaAgent SDK
 * Supports local LLMs (Ollama, LM Studio) and cloud providers (OpenAI, Anthropic)
 */

export * from './providers/LocalLLMProvider';
export * from './providers/OpenAIProvider';
export * from './providers/MockAIProvider';
export * from './prompts';
export * from './types';

