/**
 * Init Command
 * 
 * Initialize a new AI agent project from template
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

interface InitOptions {
  name?: string;
  type?: string;
  template?: string;
}

const TEMPLATES = {
  'defi-trading': {
    name: 'DeFi Trading Agent',
    description: 'Autonomous trading agent with AI-powered decisions',
    files: ['index.ts', 'package.json', 'README.md', '.env.example'],
  },
  'gaming-npc': {
    name: 'Gaming NPC Agent',
    description: 'Intelligent NPC with dynamic behavior',
    files: ['index.ts', 'package.json', 'README.md', '.env.example'],
  },
  'custom': {
    name: 'Custom Agent',
    description: 'Blank template for custom agent',
    files: ['index.ts', 'package.json', 'README.md', '.env.example'],
  },
};

export async function initCommand(options: InitOptions) {
  console.log(chalk.bold('\n🚀 Initialize New AI Agent\n'));

  // Prompt for missing options
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Agent name:',
      default: options.name || 'my-agent',
      when: !options.name,
    },
    {
      type: 'list',
      name: 'type',
      message: 'Agent type:',
      choices: [
        { name: '💰 DeFi - Trading and financial operations', value: 'defi' },
        { name: '🎮 Gaming - NPCs and game mechanics', value: 'gaming' },
        { name: '🏛️  Governance - DAO and voting', value: 'governance' },
        { name: '🔧 Custom - Build from scratch', value: 'custom' },
      ],
      when: !options.type,
    },
    {
      type: 'list',
      name: 'template',
      message: 'Choose a template:',
      choices: [
        {
          name: '📊 DeFi Trading Agent - Ready-to-use trading bot',
          value: 'defi-trading',
        },
        {
          name: '🎮 Gaming NPC Agent - Intelligent game character',
          value: 'gaming-npc',
        },
        {
          name: '🔧 Custom Agent - Blank template',
          value: 'custom',
        },
      ],
      when: !options.template,
    },
  ]);

  const config = {
    name: options.name || answers.name,
    type: options.type || answers.type,
    template: options.template || answers.template,
  };

  // Create project directory
  const projectDir = path.join(process.cwd(), config.name);
  
  if (fs.existsSync(projectDir)) {
    console.log(chalk.red(`\n❌ Directory "${config.name}" already exists!\n`));
    process.exit(1);
  }

  const spinner = ora('Creating project...').start();

  try {
    // Create directory
    fs.mkdirSync(projectDir, { recursive: true });

    // Copy template files
    const templateDir = path.join(__dirname, '../../templates', config.template);
    
    // For now, create basic files (in production, would copy from templates)
    await createProjectFiles(projectDir, config);

    spinner.succeed(chalk.green('Project created successfully!'));

    // Show success message
    console.log(chalk.bold('\n✅ Your agent is ready!\n'));
    console.log(chalk.cyan('📁 Project:'), config.name);
    console.log(chalk.cyan('🤖 Type:'), config.type);
    console.log(chalk.cyan('📋 Template:'), TEMPLATES[config.template as keyof typeof TEMPLATES].name);

    console.log(chalk.bold('\n📝 Next steps:\n'));
    console.log(chalk.gray('   1. Navigate to your project:'));
    console.log(chalk.cyan(`      $ cd ${config.name}\n`));
    console.log(chalk.gray('   2. Install dependencies:'));
    console.log(chalk.cyan('      $ npm install\n'));
    console.log(chalk.gray('   3. Configure your agent:'));
    console.log(chalk.cyan('      $ cp .env.example .env\n'));
    console.log(chalk.gray('   4. Test your agent:'));
    console.log(chalk.cyan('      $ somniaagent test\n'));
    console.log(chalk.gray('   5. Deploy to Somnia:'));
    console.log(chalk.cyan('      $ somniaagent deploy\n'));

  } catch (error) {
    spinner.fail(chalk.red('Failed to create project'));
    console.error(chalk.red('\n❌ Error:'), (error as Error).message);
    process.exit(1);
  }
}

async function createProjectFiles(projectDir: string, config: any) {
  // Create package.json
  const packageJson = {
    name: config.name,
    version: '1.0.0',
    description: `AI Agent built with SomniaAgent SDK`,
    main: 'index.ts',
    scripts: {
      start: 'ts-node index.ts',
      build: 'tsc',
      test: 'somniaagent test',
      deploy: 'somniaagent deploy',
    },
    dependencies: {
      '@somniaagent/core': '^0.1.0',
    },
    devDependencies: {
      '@types/node': '^20.10.0',
      'ts-node': '^10.9.1',
      'typescript': '^5.3.2',
    },
  };

  fs.writeFileSync(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create index.ts based on template
  let indexContent = '';
  
  if (config.template === 'defi-trading') {
    indexContent = `import { SomniaAgent } from '@somniaagent/core';

// Create DeFi trading agent
const agent = new SomniaAgent({
  name: '${config.name}',
  type: 'defi',
  autonomy: 'high',
  triggers: ['price_change', 'liquidity_event'],
});

// Initialize
await agent.init();

// Add trading logic
agent.onEvent('price_change', async (event) => {
  const { price, change } = event.data;
  
  // Analyze with AI
  const decision = await agent.ai.analyze({
    price,
    change,
    timestamp: event.timestamp,
  });
  
  // Execute if confidence is high
  if (decision.confidence > 0.7) {
    await agent.execute({
      type: decision.action,
      params: decision.params,
    });
  }
});

// Start agent
await agent.start();

console.log('🚀 Trading agent is running!');
`;
  } else if (config.template === 'gaming-npc') {
    indexContent = `import { SomniaAgent } from '@somniaagent/core';

// Create gaming NPC agent
const agent = new SomniaAgent({
  name: '${config.name}',
  type: 'gaming',
  autonomy: 'medium',
  triggers: ['player_interaction', 'game_event'],
});

// Initialize
await agent.init();

// Add NPC behavior
agent.onEvent('player_interaction', async (event) => {
  const { player, action } = event.data;
  
  // AI decides NPC response
  const decision = await agent.ai.analyze({
    player,
    action,
    context: agent.getState().data,
  });
  
  // Execute NPC action
  await agent.execute({
    type: decision.action,
    params: decision.params,
  });
});

// Start agent
await agent.start();

console.log('🎮 NPC agent is running!');
`;
  } else {
    indexContent = `import { SomniaAgent } from '@somniaagent/core';

// Create custom agent
const agent = new SomniaAgent({
  name: '${config.name}',
  type: '${config.type}',
  autonomy: 'medium',
});

// Initialize
await agent.init();

// Add your custom logic here
agent.onEvent('your_event', async (event) => {
  // Your code here
});

// Start agent
await agent.start();

console.log('🤖 Agent is running!');
`;
  }

  fs.writeFileSync(path.join(projectDir, 'index.ts'), indexContent);

  // Create .env.example
  const envContent = `# Somnia Network Configuration
PRIVATE_KEY=your_private_key_here
SOMNIA_TESTNET_RPC=https://testnet.somnia.network/rpc
SOMNIA_MAINNET_RPC=https://mainnet.somnia.network/rpc

# Agent Configuration
AGENT_NAME=${config.name}
AGENT_TYPE=${config.type}
`;

  fs.writeFileSync(path.join(projectDir, '.env.example'), envContent);

  // Create README.md
  const readmeContent = `# ${config.name}

AI Agent built with SomniaAgent SDK

## Quick Start

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Configure environment:
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

3. Test your agent:
\`\`\`bash
somniaagent test
\`\`\`

4. Deploy to Somnia:
\`\`\`bash
somniaagent deploy --network testnet
\`\`\`

## Documentation

- [SomniaAgent SDK Docs](https://docs.somniaagent.dev)
- [API Reference](https://docs.somniaagent.dev/api)
- [Examples](https://github.com/somniaagent/sdk/tree/main/examples)

## Support

- Discord: https://discord.gg/somniaagent
- GitHub: https://github.com/somniaagent/sdk
`;

  fs.writeFileSync(path.join(projectDir, 'README.md'), readmeContent);

  // Create tsconfig.json
  const tsconfigContent = {
    extends: '../../tsconfig.json',
    compilerOptions: {
      outDir: './dist',
      rootDir: './src',
    },
    include: ['**/*.ts'],
    exclude: ['node_modules', 'dist'],
  };

  fs.writeFileSync(
    path.join(projectDir, 'tsconfig.json'),
    JSON.stringify(tsconfigContent, null, 2)
  );
}

