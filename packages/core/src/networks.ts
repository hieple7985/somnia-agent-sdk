/**
 * Network configurations for Somnia blockchain
 */

import { Network } from './types';

/**
 * Somnia Shannon Testnet configuration
 * Official testnet for Somnia blockchain
 * Faucet: https://testnet.somnia.network or https://thirdweb.com/somnia-shannon-testnet
 */
export const SomniaTestnet: Network = {
  name: 'Somnia Shannon Testnet',
  chainId: 50312,
  rpcUrl: 'https://50312.rpc.thirdweb.com',
  explorerUrl: 'https://testnet.somnia.network',
};

/**
 * Somnia Mainnet configuration
 * Official mainnet for Somnia blockchain
 */
export const SomniaMainnet: Network = {
  name: 'Somnia Mainnet',
  chainId: 5031,
  rpcUrl: 'https://api.infra.mainnet.somnia.network',
  explorerUrl: 'https://somnia.network',
};

/**
 * Available networks
 */
export const Networks: Record<string, Network> = {
  testnet: SomniaTestnet,
  mainnet: SomniaMainnet,
};

/**
 * Get network by name
 */
export function getNetwork(name: string): Network {
  const network = Networks[name.toLowerCase()];
  if (!network) {
    throw new Error(`Unknown network: ${name}`);
  }
  return network;
}

/**
 * Check if network is testnet
 */
export function isTestnet(network: Network | string): boolean {
  const net = typeof network === 'string' ? getNetwork(network) : network;
  return net.name.toLowerCase().includes('testnet');
}

