# @somniaagent/ai

> AI/ML Integration Layer for SomniaAgent SDK

**Free to run with local LLM support!**

## 🎯 Overview

The AI package provides a flexible AI/ML integration layer that supports both cloud-based and local AI models. Run your agents completely free with local LLMs like Ollama or LM Studio.

## ✨ Features

- 🆓 **Free Local LLM Support** - Run Ollama, LM Studio, or any OpenAI-compatible API
- ☁️ **Cloud AI Support** - OpenAI, Anthropic, Google Gemini
- 🔌 **Pluggable Architecture** - Easy to add custom AI providers
- 🎯 **Agent-Optimized** - Pre-configured prompts for trading, gaming, etc.
- 📊 **Decision Tracking** - Log and analyze AI decisions
- 🧪 **Mock AI** - For testing without AI costs

## 🚀 Quick Start

### Using Local LLM (Free!)

```typescript
import { SomniaAgent } from '@somniaagent/core';
import { LocalLLMProvider } from '@somniaagent/ai';

const agent = new SomniaAgent({
  name: 'MyTradingBot',
  type: 'defi',
  ai: new LocalLLMProvider({
    model: 'llama3.2',
    endpoint: 'http://localhost:11434', // Ollama default
  }),
});

await agent.init();

agent.onEvent('price_change', async (event) => {
  const decision = await agent.ai.analyze(event.data);
  if (decision.confidence > 0.7) {
    await agent.execute(decision.action);
  }
});
```

### Using Cloud AI

```typescript
import { OpenAIProvider } from '@somniaagent/ai';

const agent = new SomniaAgent({
  name: 'MyTradingBot',
  type: 'defi',
  ai: new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
  }),
});
```

## 🔧 Supported Providers

### Local LLMs (Free)

1. **Ollama** - Run Llama, Mistral, etc. locally
   ```bash
   # Install Ollama
   curl -fsSL https://ollama.com/install.sh | sh
   
   # Pull a model
   ollama pull llama3.2
   
   # Start server (runs on localhost:11434)
   ollama serve
   ```

2. **LM Studio** - GUI for local LLMs
   - Download from https://lmstudio.ai
   - Load any GGUF model
   - Enable local server (localhost:1234)

3. **LocalAI** - OpenAI-compatible local server
   ```bash
   docker run -p 8080:8080 localai/localai
   ```

### Cloud Providers

1. **OpenAI** - GPT-4, GPT-3.5
2. **Anthropic** - Claude 3
3. **Google** - Gemini Pro
4. **Mistral AI** - Mistral Large

## 📚 API Reference

### LocalLLMProvider

```typescript
import { LocalLLMProvider } from '@somniaagent/ai';

const provider = new LocalLLMProvider({
  model: 'llama3.2',           // Model name
  endpoint: 'http://localhost:11434', // API endpoint
  temperature: 0.7,            // Creativity (0-1)
  maxTokens: 1000,            // Max response length
  systemPrompt: 'You are...',  // Custom system prompt
});

// Analyze data
const decision = await provider.analyze({
  type: 'price_change',
  data: { price: 1000, change: 0.05 },
});

// decision = {
//   action: 'buy',
//   confidence: 0.85,
//   reasoning: 'Price increased 5%...',
//   params: { amount: 1, price: 1000 }
// }
```

### OpenAIProvider

```typescript
import { OpenAIProvider } from '@somniaagent/ai';

const provider = new OpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4',
  temperature: 0.7,
});
```

### MockAIProvider (for testing)

```typescript
import { MockAIProvider } from '@somniaagent/ai';

const provider = new MockAIProvider({
  defaultAction: 'buy',
  defaultConfidence: 0.8,
  randomize: true, // Random decisions for testing
});
```

## 🎯 Agent-Specific Prompts

Pre-configured prompts for different agent types:

```typescript
import { DeFiTradingPrompt, GamingNPCPrompt } from '@somniaagent/ai';

// DeFi Trading Agent
const tradingAgent = new SomniaAgent({
  ai: new LocalLLMProvider({
    model: 'llama3.2',
    systemPrompt: DeFiTradingPrompt,
  }),
});

// Gaming NPC Agent
const npcAgent = new SomniaAgent({
  ai: new LocalLLMProvider({
    model: 'llama3.2',
    systemPrompt: GamingNPCPrompt,
  }),
});
```

## 💰 Cost Comparison

| Provider | Cost | Speed | Quality |
|----------|------|-------|---------|
| **Ollama (Local)** | **$0** | Fast | Good |
| **LM Studio (Local)** | **$0** | Fast | Good |
| OpenAI GPT-4 | $0.03/1K tokens | Fast | Excellent |
| OpenAI GPT-3.5 | $0.002/1K tokens | Very Fast | Good |
| Anthropic Claude | $0.015/1K tokens | Fast | Excellent |

**Recommendation:** Start with local LLMs for development and testing (free!), then upgrade to cloud AI for production if needed.

## 🧪 Testing

```typescript
import { MockAIProvider } from '@somniaagent/ai';

// Use mock AI for testing
const agent = new SomniaAgent({
  ai: new MockAIProvider({
    defaultAction: 'buy',
    defaultConfidence: 0.8,
  }),
});

// Test without AI costs
await agent.test();
```

## 📖 Examples

See [examples/](../../examples/) for complete examples:
- `simple-trading-bot/` - Basic trading bot with local LLM
- `advanced-defi-agent/` - Advanced DeFi agent with cloud AI

## 🤝 Contributing

Want to add a new AI provider? See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## 📄 License

MIT License - see [LICENSE](../../LICENSE)

---

**Built with ❤️ for the Somnia ecosystem**

