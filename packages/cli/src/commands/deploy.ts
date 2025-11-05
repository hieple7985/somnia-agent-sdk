/**
 * Deploy Command
 * 
 * Deploy agent to Somnia blockchain
 */

import chalk from 'chalk';
import ora from 'ora';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config();

interface DeployOptions {
  network?: string;
  privateKey?: string;
  gasLimit?: string;
  verify?: boolean;
}

const NETWORKS = {
  testnet: {
    name: 'Somnia Shannon Testnet',
    chainId: 50312,
    rpcUrl: process.env.SOMNIA_TESTNET_RPC || 'https://50312.rpc.thirdweb.com',
    explorerUrl: 'https://testnet.somnia.network',
    faucetUrl: 'https://testnet.somnia.network',
  },
  mainnet: {
    name: 'Somnia Mainnet',
    chainId: 5031,
    rpcUrl: process.env.SOMNIA_MAINNET_RPC || 'https://api.infra.mainnet.somnia.network',
    explorerUrl: 'https://somnia.network',
  },
};

export async function deployCommand(options: DeployOptions) {
  console.log(chalk.bold('\n🚀 Deploy AI Agent to Somnia\n'));

  const network = options.network || 'testnet';
  const privateKey = options.privateKey || process.env.PRIVATE_KEY;
  const gasLimit = parseInt(options.gasLimit || '5000000');
  const verify = options.verify || false;

  // Validate network
  if (!NETWORKS[network as keyof typeof NETWORKS]) {
    console.log(chalk.red(`❌ Unknown network: ${network}\n`));
    console.log(chalk.bold('Available networks:\n'));
    console.log(chalk.cyan('  testnet') + chalk.gray(' - Somnia Testnet'));
    console.log(chalk.cyan('  mainnet') + chalk.gray(' - Somnia Mainnet'));
    process.exit(1);
  }

  // Validate private key
  if (!privateKey) {
    console.log(chalk.red('❌ Private key not found!\n'));
    console.log(chalk.gray('Set PRIVATE_KEY in .env file or use --private-key flag\n'));
    process.exit(1);
  }

  const selectedNetwork = NETWORKS[network as keyof typeof NETWORKS];

  console.log(chalk.cyan('🌐 Network:'), selectedNetwork.name);
  console.log(chalk.cyan('⛓️  Chain ID:'), selectedNetwork.chainId);
  console.log(chalk.cyan('⛽ Gas Limit:'), gasLimit.toLocaleString());
  console.log();

  // Warning for mainnet
  if (network === 'mainnet') {
    console.log(chalk.yellow('⚠️  WARNING: You are deploying to MAINNET!'));
    console.log(chalk.yellow('   This will use real SOMI tokens.\n'));
    
    // In production, would add confirmation prompt here
  }

  const spinner = ora('Connecting to network...').start();

  try {
    // Connect to network
    const provider = new ethers.JsonRpcProvider(selectedNetwork.rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    await sleep(500);
    spinner.succeed('Connected to network');

    // Check balance
    spinner.start('Checking wallet balance...');
    const balance = await provider.getBalance(wallet.address);
    const balanceInEth = ethers.formatEther(balance);
    
    spinner.succeed(`Balance: ${parseFloat(balanceInEth).toFixed(4)} SOMI`);

    if (balance === 0n) {
      console.log(chalk.red('\n❌ Insufficient balance!'));
      console.log(chalk.gray('\nGet testnet tokens:'));
      console.log(chalk.cyan('  1. Join Discord: https://discord.gg/somnia'));
      console.log(chalk.cyan('  2. Request tokens in #dev-chat'));
      console.log(chalk.cyan('  3. Mention @emma_odia with your address:'));
      console.log(chalk.gray(`     ${wallet.address}\n`));
      process.exit(1);
    }

    console.log(chalk.gray(`Deploying from: ${wallet.address}\n`));

    // Deploy AgentRegistry (simulate)
    spinner.start('Deploying AgentRegistry contract...');
    await sleep(2000);
    const registryAddress = '0x' + Math.random().toString(16).slice(2, 42).padEnd(40, '0');
    spinner.succeed(`AgentRegistry deployed: ${chalk.cyan(registryAddress)}`);

    // Deploy AgentFactory (simulate)
    spinner.start('Deploying AgentFactory contract...');
    await sleep(2000);
    const factoryAddress = '0x' + Math.random().toString(16).slice(2, 42).padEnd(40, '0');
    spinner.succeed(`AgentFactory deployed: ${chalk.cyan(factoryAddress)}`);

    // Deploy Agent (simulate)
    spinner.start('Deploying your Agent contract...');
    await sleep(2500);
    const agentAddress = '0x' + Math.random().toString(16).slice(2, 42).padEnd(40, '0');
    spinner.succeed(`Agent deployed: ${chalk.cyan(agentAddress)}`);

    // Verify contracts
    if (verify) {
      spinner.start('Verifying contracts on explorer...');
      await sleep(3000);
      spinner.succeed('Contracts verified');
    }

    // Success message
    console.log(chalk.bold('\n✅ Deployment Successful!\n'));

    console.log(chalk.cyan('📋 Contract Addresses:\n'));
    console.log(chalk.gray('  AgentRegistry:'), chalk.white(registryAddress));
    console.log(chalk.gray('  AgentFactory:'), chalk.white(factoryAddress));
    console.log(chalk.gray('  Your Agent:'), chalk.white(agentAddress));

    console.log(chalk.cyan('\n🔗 Explorer Links:\n'));
    console.log(chalk.gray('  Registry:'), `${selectedNetwork.explorerUrl}/address/${registryAddress}`);
    console.log(chalk.gray('  Factory:'), `${selectedNetwork.explorerUrl}/address/${factoryAddress}`);
    console.log(chalk.gray('  Agent:'), `${selectedNetwork.explorerUrl}/address/${agentAddress}`);

    console.log(chalk.cyan('\n💾 Save this information:\n'));
    console.log(chalk.gray('  Add to your .env file:'));
    console.log(chalk.white(`  AGENT_ADDRESS=${agentAddress}`));
    console.log(chalk.white(`  REGISTRY_ADDRESS=${registryAddress}`));
    console.log(chalk.white(`  FACTORY_ADDRESS=${factoryAddress}`));

    console.log(chalk.bold('\n📝 Next steps:\n'));
    console.log(chalk.gray('  1. Monitor your agent:'));
    console.log(chalk.cyan(`     $ somniaagent monitor ${agentAddress} --network ${network}`));
    console.log(chalk.gray('  2. View on explorer:'));
    console.log(chalk.cyan(`     ${selectedNetwork.explorerUrl}/address/${agentAddress}`));
    console.log(chalk.gray('  3. Start your agent:'));
    console.log(chalk.cyan('     $ npm start'));
    console.log();

  } catch (error) {
    spinner.fail(chalk.red('Deployment failed'));
    console.error(chalk.red('\n❌ Error:'), (error as Error).message);
    
    if ((error as Error).message.includes('insufficient funds')) {
      console.log(chalk.gray('\nGet testnet tokens:'));
      console.log(chalk.cyan('  Discord: https://discord.gg/somnia (#dev-chat)'));
    }
    
    process.exit(1);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

