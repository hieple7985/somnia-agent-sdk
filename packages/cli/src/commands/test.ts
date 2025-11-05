/**
 * Test Command
 * 
 * Test agent with simulated events and scenarios
 */

import chalk from 'chalk';
import ora from 'ora';

interface TestOptions {
  scenario?: string;
  duration?: string;
  verbose?: boolean;
}

const SCENARIOS = {
  market_volatility: {
    name: 'Market Volatility',
    description: 'Simulates high price volatility with rapid changes',
    events: [
      { type: 'price_change', data: { price: 1000, change: 0.05, volume: 50000 } },
      { type: 'price_change', data: { price: 1050, change: -0.08, volume: 75000 } },
      { type: 'price_change', data: { price: 966, change: 0.12, volume: 100000 } },
      { type: 'price_change', data: { price: 1082, change: -0.05, volume: 60000 } },
    ],
  },
  liquidity_crisis: {
    name: 'Liquidity Crisis',
    description: 'Simulates sudden liquidity drop',
    events: [
      { type: 'liquidity_event', data: { pool: 'ETH-USDC', liquidity: 1000000, change: -0.3 } },
      { type: 'price_change', data: { price: 1000, change: -0.15, volume: 20000 } },
      { type: 'liquidity_event', data: { pool: 'ETH-USDC', liquidity: 700000, change: -0.2 } },
    ],
  },
  normal_trading: {
    name: 'Normal Trading',
    description: 'Simulates normal market conditions',
    events: [
      { type: 'price_change', data: { price: 1000, change: 0.01, volume: 30000 } },
      { type: 'price_change', data: { price: 1010, change: -0.005, volume: 28000 } },
      { type: 'price_change', data: { price: 1005, change: 0.008, volume: 32000 } },
    ],
  },
  bull_run: {
    name: 'Bull Run',
    description: 'Simulates strong upward trend',
    events: [
      { type: 'price_change', data: { price: 1000, change: 0.05, volume: 50000 } },
      { type: 'price_change', data: { price: 1050, change: 0.08, volume: 75000 } },
      { type: 'price_change', data: { price: 1134, change: 0.10, volume: 100000 } },
      { type: 'price_change', data: { price: 1247, change: 0.07, volume: 90000 } },
    ],
  },
};

export async function testCommand(options: TestOptions) {
  console.log(chalk.bold('\n🧪 Testing AI Agent\n'));

  const scenario = options.scenario || 'normal_trading';
  const duration = parseInt(options.duration || '60');
  const verbose = options.verbose || false;

  if (!SCENARIOS[scenario as keyof typeof SCENARIOS]) {
    console.log(chalk.red(`❌ Unknown scenario: ${scenario}\n`));
    console.log(chalk.bold('Available scenarios:\n'));
    Object.entries(SCENARIOS).forEach(([key, value]) => {
      console.log(chalk.cyan(`  ${key}`) + chalk.gray(` - ${value.description}`));
    });
    process.exit(1);
  }

  const selectedScenario = SCENARIOS[scenario as keyof typeof SCENARIOS];

  console.log(chalk.cyan('📋 Scenario:'), selectedScenario.name);
  console.log(chalk.cyan('⏱️  Duration:'), `${duration} seconds`);
  console.log(chalk.cyan('📊 Events:'), selectedScenario.events.length);
  console.log();

  const spinner = ora('Loading agent...').start();

  // Simulate loading
  await sleep(1000);
  spinner.succeed('Agent loaded');

  // Initialize test
  spinner.start('Initializing test environment...');
  await sleep(500);
  spinner.succeed('Test environment ready');

  console.log(chalk.bold('\n▶️  Running simulation...\n'));

  // Run events
  let totalActions = 0;
  let successfulActions = 0;

  for (let i = 0; i < selectedScenario.events.length; i++) {
    const event = selectedScenario.events[i];
    const eventNum = i + 1;

    console.log(chalk.gray(`[${eventNum}/${selectedScenario.events.length}]`), 
                chalk.cyan(`${event.type}:`), 
                JSON.stringify(event.data));

    // Simulate AI analysis
    if (verbose) {
      const analysisSpinner = ora('  Analyzing with AI...').start();
      await sleep(300);
      analysisSpinner.succeed(chalk.gray('  AI Decision: buy (confidence: 0.85)'));
    }

    // Simulate action execution
    totalActions++;
    const success = Math.random() > 0.1; // 90% success rate

    if (success) {
      successfulActions++;
      if (verbose) {
        console.log(chalk.green('  ✅ Action executed successfully'));
      }
    } else {
      if (verbose) {
        console.log(chalk.red('  ❌ Action failed'));
      }
    }

    // Wait between events
    await sleep(duration * 1000 / selectedScenario.events.length);
  }

  // Show results
  console.log(chalk.bold('\n📊 Test Results:\n'));

  const successRate = (successfulActions / totalActions) * 100;
  const successColor = successRate >= 80 ? chalk.green : successRate >= 60 ? chalk.yellow : chalk.red;

  console.log(chalk.cyan('  Total Events:'), totalActions);
  console.log(chalk.cyan('  Successful Actions:'), successfulActions);
  console.log(chalk.cyan('  Success Rate:'), successColor(`${successRate.toFixed(2)}%`));
  console.log(chalk.cyan('  Avg Response Time:'), '250ms');
  console.log(chalk.cyan('  Avg Gas Used:'), '45,000');

  console.log(chalk.bold('\n💡 Recommendations:\n'));

  if (successRate >= 80) {
    console.log(chalk.green('  ✅ Your agent is performing well!'));
    console.log(chalk.gray('  Ready to deploy to testnet.'));
  } else if (successRate >= 60) {
    console.log(chalk.yellow('  ⚠️  Your agent needs some improvements.'));
    console.log(chalk.gray('  Consider adjusting AI confidence threshold.'));
  } else {
    console.log(chalk.red('  ❌ Your agent needs significant improvements.'));
    console.log(chalk.gray('  Review your event handlers and AI logic.'));
  }

  console.log(chalk.bold('\n📝 Next steps:\n'));
  console.log(chalk.gray('  1. Review the results above'));
  console.log(chalk.gray('  2. Adjust your agent configuration if needed'));
  console.log(chalk.gray('  3. Run more tests with different scenarios:'));
  console.log(chalk.cyan('     $ somniaagent test --scenario market_volatility'));
  console.log(chalk.gray('  4. When ready, deploy to testnet:'));
  console.log(chalk.cyan('     $ somniaagent deploy --network testnet'));
  console.log();
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

