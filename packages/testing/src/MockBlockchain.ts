/**
 * Mock Blockchain
 * 
 * Simulates blockchain behavior for testing without real network
 */

import EventEmitter from 'eventemitter3';

export interface Block {
  number: number;
  timestamp: number;
  transactions: Transaction[];
  hash: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  data: string;
  gasUsed: number;
  status: 'success' | 'failed';
}

export class MockBlockchain {
  private eventEmitter: EventEmitter;
  private blocks: Block[] = [];
  private currentBlockNumber: number = 0;
  private accounts: Map<string, string> = new Map(); // address -> balance
  private contracts: Map<string, any> = new Map(); // address -> contract state
  private blockTime: number = 1000; // 1 second per block
  private isRunning: boolean = false;

  constructor() {
    this.eventEmitter = new EventEmitter();
    this.initializeGenesisBlock();
  }

  /**
   * Initialize genesis block
   */
  private initializeGenesisBlock(): void {
    const genesisBlock: Block = {
      number: 0,
      timestamp: Date.now(),
      transactions: [],
      hash: this.generateHash('genesis'),
    };
    this.blocks.push(genesisBlock);
  }

  /**
   * Start mining blocks
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.mineBlocks();
  }

  /**
   * Stop mining blocks
   */
  stop(): void {
    this.isRunning = false;
  }

  /**
   * Mine new blocks
   */
  private async mineBlocks(): Promise<void> {
    while (this.isRunning) {
      await this.sleep(this.blockTime);
      this.mineBlock();
    }
  }

  /**
   * Mine a single block
   */
  private mineBlock(): void {
    this.currentBlockNumber++;

    const block: Block = {
      number: this.currentBlockNumber,
      timestamp: Date.now(),
      transactions: [],
      hash: this.generateHash(`block-${this.currentBlockNumber}`),
    };

    this.blocks.push(block);
    this.eventEmitter.emit('block', block);
  }

  /**
   * Send transaction
   */
  async sendTransaction(tx: Partial<Transaction>): Promise<Transaction> {
    const transaction: Transaction = {
      hash: this.generateHash(`tx-${Date.now()}`),
      from: tx.from || '0x0000000000000000000000000000000000000000',
      to: tx.to || '0x0000000000000000000000000000000000000000',
      value: tx.value || '0',
      data: tx.data || '0x',
      gasUsed: tx.gasUsed || 21000 + Math.floor(Math.random() * 30000),
      status: Math.random() > 0.1 ? 'success' : 'failed', // 90% success rate
    };

    // Add to current block
    const currentBlock = this.blocks[this.blocks.length - 1];
    currentBlock.transactions.push(transaction);

    // Emit transaction event
    this.eventEmitter.emit('transaction', transaction);

    return transaction;
  }

  /**
   * Deploy contract
   */
  async deployContract(bytecode: string, from: string): Promise<string> {
    const contractAddress = this.generateAddress();

    // Store contract
    this.contracts.set(contractAddress, {
      bytecode,
      owner: from,
      state: {},
      deployed: Date.now(),
    });

    // Send deployment transaction
    await this.sendTransaction({
      from,
      to: '0x0000000000000000000000000000000000000000',
      data: bytecode,
    });

    return contractAddress;
  }

  /**
   * Call contract method
   */
  async callContract(
    contractAddress: string,
    method: string,
    params: any[],
    from: string
  ): Promise<any> {
    const contract = this.contracts.get(contractAddress);

    if (!contract) {
      throw new Error('Contract not found');
    }

    // Simulate contract call
    const tx = await this.sendTransaction({
      from,
      to: contractAddress,
      data: this.encodeMethodCall(method, params),
    });

    // Return mock result
    return {
      success: tx.status === 'success',
      txHash: tx.hash,
      gasUsed: tx.gasUsed,
    };
  }

  /**
   * Get account balance
   */
  getBalance(address: string): string {
    return this.accounts.get(address) || '1000000000000000000000'; // 1000 ETH default
  }

  /**
   * Set account balance
   */
  setBalance(address: string, balance: string): void {
    this.accounts.set(address, balance);
  }

  /**
   * Get block by number
   */
  getBlock(blockNumber: number): Block | undefined {
    return this.blocks.find(b => b.number === blockNumber);
  }

  /**
   * Get latest block
   */
  getLatestBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  /**
   * Get transaction by hash
   */
  getTransaction(hash: string): Transaction | undefined {
    for (const block of this.blocks) {
      const tx = block.transactions.find(t => t.hash === hash);
      if (tx) return tx;
    }
    return undefined;
  }

  /**
   * Subscribe to events
   */
  on(event: string, handler: (...args: any[]) => void): void {
    this.eventEmitter.on(event, handler);
  }

  /**
   * Unsubscribe from events
   */
  off(event: string, handler: (...args: any[]) => void): void {
    this.eventEmitter.off(event, handler);
  }

  /**
   * Generate random hash
   */
  private generateHash(seed: string): string {
    return '0x' + Buffer.from(seed + Date.now()).toString('hex').slice(0, 64).padEnd(64, '0');
  }

  /**
   * Generate random address
   */
  private generateAddress(): string {
    return '0x' + Math.random().toString(16).slice(2, 42).padEnd(40, '0');
  }

  /**
   * Encode method call
   */
  private encodeMethodCall(method: string, params: any[]): string {
    return '0x' + Buffer.from(method + JSON.stringify(params)).toString('hex');
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Reset blockchain
   */
  reset(): void {
    this.blocks = [];
    this.currentBlockNumber = 0;
    this.accounts.clear();
    this.contracts.clear();
    this.initializeGenesisBlock();
  }

  /**
   * Get blockchain stats
   */
  getStats() {
    const totalTransactions = this.blocks.reduce(
      (sum, block) => sum + block.transactions.length,
      0
    );

    return {
      blockNumber: this.currentBlockNumber,
      totalBlocks: this.blocks.length,
      totalTransactions,
      totalAccounts: this.accounts.size,
      totalContracts: this.contracts.size,
    };
  }
}

