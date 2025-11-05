/**
 * List Command
 * 
 * List all deployed agents
 */

import chalk from 'chalk';
import ora from 'ora';

interface ListOptions {
  network?: string;
}

export async function listCommand(options: ListOptions) {
  console.log(chalk.bold('\n📋 Your Deployed Agents\n'));

  const network = options.network || 'testnet';

  console.log(chalk.cyan('🌐 Network:'), network);
  console.log();

  const spinner = ora('Fetching agents...').start();
  await sleep(1500);

  // Simulate fetching agents
  const agents = [
    {
      name: 'DeFiTradingBot',
      address: '0x1234567890123456789012345678901234567890',
      type: 'defi',
      status: 'running',
      deployed: '2 days ago',
      actions: 1247,
      successRate: 87.5,
    },
    {
      name: 'GamingNPC',
      address: '0x2345678901234567890123456789012345678901',
      type: 'gaming',
      status: 'paused',
      deployed: '5 days ago',
      actions: 3421,
      successRate: 92.3,
    },
    {
      name: 'GovernanceAgent',
      address: '0x3456789012345678901234567890123456789012',
      type: 'governance',
      status: 'running',
      deployed: '1 week ago',
      actions: 156,
      successRate: 95.1,
    },
  ];

  spinner.succeed(`Found ${agents.length} agents`);

  console.log();

  // Display agents
  agents.forEach((agent, index) => {
    const statusColor = agent.status === 'running' ? chalk.green : chalk.yellow;
    const statusIcon = agent.status === 'running' ? '▶️ ' : '⏸️ ';

    console.log(chalk.bold(`${index + 1}. ${agent.name}`));
    console.log(chalk.gray('   Address:'), chalk.white(agent.address));
    console.log(chalk.gray('   Type:'), agent.type);
    console.log(chalk.gray('   Status:'), statusIcon + statusColor(agent.status));
    console.log(chalk.gray('   Deployed:'), agent.deployed);
    console.log(chalk.gray('   Actions:'), agent.actions.toLocaleString());
    console.log(chalk.gray('   Success Rate:'), chalk.green(`${agent.successRate}%`));
    console.log();
  });

  // Summary
  const totalActions = agents.reduce((sum, agent) => sum + agent.actions, 0);
  const avgSuccessRate = agents.reduce((sum, agent) => sum + agent.successRate, 0) / agents.length;
  const runningAgents = agents.filter(a => a.status === 'running').length;

  console.log(chalk.bold('📊 Summary:\n'));
  console.log(chalk.gray('  Total Agents:'), agents.length);
  console.log(chalk.gray('  Running:'), chalk.green(runningAgents));
  console.log(chalk.gray('  Paused:'), chalk.yellow(agents.length - runningAgents));
  console.log(chalk.gray('  Total Actions:'), totalActions.toLocaleString());
  console.log(chalk.gray('  Avg Success Rate:'), chalk.green(`${avgSuccessRate.toFixed(2)}%`));

  console.log(chalk.bold('\n💡 Commands:\n'));
  console.log(chalk.gray('  Monitor an agent:'));
  console.log(chalk.cyan('  $ somniaagent monitor <address> --network ' + network));
  console.log(chalk.gray('  Deploy new agent:'));
  console.log(chalk.cyan('  $ somniaagent init --template defi-trading'));
  console.log();
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

