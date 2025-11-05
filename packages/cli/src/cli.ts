#!/usr/bin/env node

/**
 * SomniaAgent CLI
 * 
 * Command-line interface for creating, testing, and deploying AI agents
 */

import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import { initCommand } from './commands/init';
import { testCommand } from './commands/test';
import { deployCommand } from './commands/deploy';
import { monitorCommand } from './commands/monitor';
import { listCommand } from './commands/list';

const program = new Command();

// ASCII Art Banner
const banner = `
╔═══════════════════════════════════════╗
║                                       ║
║   ${chalk.cyan.bold('SomniaAgent SDK')}                  ║
║   ${chalk.gray('Build AI Agents in 10 Minutes')}    ║
║                                       ║
╚═══════════════════════════════════════╝
`;

console.log(banner);

// Program configuration
program
  .name('somniaagent')
  .description('CLI tool for building AI agents on Somnia blockchain')
  .version('0.1.0');

// Init command
program
  .command('init')
  .description('Initialize a new AI agent project')
  .option('-n, --name <name>', 'Agent name')
  .option('-t, --type <type>', 'Agent type (defi, gaming, governance, custom)')
  .option('--template <template>', 'Use a template (defi-trading, gaming-npc, custom)')
  .action(initCommand);

// Test command
program
  .command('test')
  .description('Test your agent with simulated events')
  .option('-s, --scenario <scenario>', 'Test scenario (market_volatility, liquidity_crisis, etc.)')
  .option('-d, --duration <seconds>', 'Test duration in seconds', '60')
  .option('-v, --verbose', 'Verbose output')
  .action(testCommand);

// Deploy command
program
  .command('deploy')
  .description('Deploy your agent to Somnia blockchain')
  .option('-n, --network <network>', 'Network (testnet, mainnet)', 'testnet')
  .option('-k, --private-key <key>', 'Private key (or use PRIVATE_KEY env var)')
  .option('--gas-limit <limit>', 'Gas limit', '5000000')
  .option('--verify', 'Verify contract on explorer')
  .action(deployCommand);

// Monitor command
program
  .command('monitor')
  .description('Monitor your deployed agent')
  .argument('<address>', 'Agent contract address')
  .option('-n, --network <network>', 'Network (testnet, mainnet)', 'testnet')
  .option('-i, --interval <seconds>', 'Refresh interval in seconds', '5')
  .action(monitorCommand);

// List command
program
  .command('list')
  .description('List all your deployed agents')
  .option('-n, --network <network>', 'Network (testnet, mainnet)', 'testnet')
  .action(listCommand);

// Info command
program
  .command('info')
  .description('Show information about SomniaAgent SDK')
  .action(() => {
    const info = boxen(
      `${chalk.bold('SomniaAgent SDK v0.1.0')}\n\n` +
      `${chalk.cyan('Website:')} https://somniaagent.dev\n` +
      `${chalk.cyan('Docs:')} https://docs.somniaagent.dev\n` +
      `${chalk.cyan('GitHub:')} https://github.com/somniaagent/sdk\n` +
      `${chalk.cyan('Discord:')} https://discord.gg/somniaagent\n\n` +
      `${chalk.gray('Built for Somnia AI Hackathon 2025')}`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
      }
    );
    console.log(info);
  });

// Examples command
program
  .command('examples')
  .description('Show usage examples')
  .action(() => {
    console.log(chalk.bold('\n📚 SomniaAgent CLI Examples\n'));
    
    console.log(chalk.cyan('1. Create a new DeFi trading agent:'));
    console.log(chalk.gray('   $ somniaagent init --name MyTradingBot --template defi-trading\n'));
    
    console.log(chalk.cyan('2. Test your agent with market volatility:'));
    console.log(chalk.gray('   $ somniaagent test --scenario market_volatility --duration 120\n'));
    
    console.log(chalk.cyan('3. Deploy to Somnia testnet:'));
    console.log(chalk.gray('   $ somniaagent deploy --network testnet\n'));
    
    console.log(chalk.cyan('4. Monitor your deployed agent:'));
    console.log(chalk.gray('   $ somniaagent monitor 0x1234... --network testnet\n'));
    
    console.log(chalk.cyan('5. List all your agents:'));
    console.log(chalk.gray('   $ somniaagent list --network testnet\n'));
  });

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
  
  console.log(chalk.bold('\n💡 Quick Start:\n'));
  console.log(chalk.gray('   1. Create a new agent:'));
  console.log(chalk.cyan('      $ somniaagent init --template defi-trading\n'));
  console.log(chalk.gray('   2. Test it:'));
  console.log(chalk.cyan('      $ somniaagent test\n'));
  console.log(chalk.gray('   3. Deploy it:'));
  console.log(chalk.cyan('      $ somniaagent deploy\n'));
  
  console.log(chalk.gray('\n   Run "somniaagent examples" for more examples\n'));
}

