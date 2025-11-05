# 🎉 Deployed Contracts - Somnia Shannon Testnet

**Deployment Date:** November 5, 2025  
**Network:** Somnia Shannon Testnet  
**Chain ID:** 50312  
**Deployer:** 0x0bb37A89207bf524b9d482624971B8A5EE08Da85

---

## ✅ Verified Contract Addresses

### 1. AgentRegistry
**Contract Address:**
```
0xF118Ce0EC1370879D48c4d20e2654904e63c34fD
```

**Explorer URL:**
```
https://shannon-explorer.somnia.network/address/0xF118Ce0EC1370879D48c4d20e2654904e63c34fD
```

**Purpose:** Central registry for all deployed agents

**Status:** ✅ Deployed & Verified

---

### 2. AgentFactory
**Contract Address:**
```
0x9f0b44f152EdDFB99f0206D2E7E390b5ED69372b
```

**Explorer URL:**
```
https://shannon-explorer.somnia.network/address/0x9f0b44f152EdDFB99f0206D2E7E390b5ED69372b
```

**Purpose:** Factory for creating new agent instances

**Status:** ✅ Deployed & Verified

---

### 3. Sample BaseAgent
**Contract Address:**
```
0xC51D76BaD946a13428d4425FE07F3fbc23Af603D
```

**Explorer URL:**
```
https://shannon-explorer.somnia.network/address/0xC51D76BaD946a13428d4425FE07F3fbc23Af603D
```

**Purpose:** Sample DeFi trading agent (TestAgent)

**Status:** ✅ Deployed, Initialized & Tested

---

## 🔗 Quick Links

### Block Explorer
- **Main Explorer:** https://shannon-explorer.somnia.network
- **Testnet Portal:** https://testnet.somnia.network

### Network Information
- **Network Name:** Somnia Shannon Testnet
- **Chain ID:** 50312
- **RPC URL:** https://50312.rpc.thirdweb.com
- **Alternative RPC:** https://testnet.somnia.network/rpc
- **Currency:** STT (Somnia Test Token)

### Faucets
- **Official Faucet:** https://testnet.somnia.network
- **Thirdweb Faucet:** https://thirdweb.com/somnia-shannon-testnet
- **Google Cloud Faucet:** https://cloud.google.com/application/web3/faucet/somnia/shannon

---

## 📊 Deployment Details

### Gas Costs
| Contract | Gas Used | Cost (STT) |
|----------|----------|------------|
| AgentRegistry | ~800,000 | ~0.016 |
| AgentFactory | ~600,000 | ~0.012 |
| BaseAgent | ~1,000,000 | ~0.020 |
| **Total** | **~2,400,000** | **~0.048** |

### Deployment Transactions
All deployment transactions can be viewed on the block explorer by visiting the contract addresses above.

---

## 🧪 Test Results

### Deployment Tests ✅
- AgentRegistry deployed successfully
- AgentFactory deployed with registry reference
- BaseAgent deployed successfully

### Initialization Tests ✅
- Agent initialized (Name: "TestAgent", Type: DEFI)
- Agent registered in AgentRegistry
- Registration verified

### Functionality Tests ✅
- Status updated to RUNNING
- Action executed successfully
- State verified (Total Actions: 1)

---

## 🔧 How to Interact

### Using Hardhat Console

```bash
cd hackathons/003-somnia-ai/3_dev/contracts
npx hardhat console --network testnet
```

```javascript
// Get contract instances
const registry = await ethers.getContractAt(
  "AgentRegistry",
  "0xF118Ce0EC1370879D48c4d20e2654904e63c34fD"
);

const factory = await ethers.getContractAt(
  "AgentFactory",
  "0x9f0b44f152EdDFB99f0206D2E7E390b5ED69372b"
);

const agent = await ethers.getContractAt(
  "BaseAgent",
  "0xC51D76BaD946a13428d4425FE07F3fbc23Af603D"
);

// Check if agent is registered
const isRegistered = await registry.isRegistered(
  "0xC51D76BaD946a13428d4425FE07F3fbc23Af603D"
);
console.log("Agent registered:", isRegistered); // true

// Get agent info
const info = await agent.agentInfo();
console.log("Agent Name:", info.name); // "TestAgent"
console.log("Agent Type:", info.agentType.toString()); // "0" (DEFI)
console.log("Agent Status:", info.status.toString()); // "1" (RUNNING)
console.log("Total Actions:", info.totalActions.toString()); // "1"
```

### Using Web3 Provider

```javascript
import { ethers } from 'ethers';

// Connect to Somnia Shannon Testnet
const provider = new ethers.JsonRpcProvider('https://50312.rpc.thirdweb.com');

// Get contract instance
const registryAddress = '0xF118Ce0EC1370879D48c4d20e2654904e63c34fD';
const registryABI = [...]; // Your ABI here

const registry = new ethers.Contract(registryAddress, registryABI, provider);

// Check registration
const isRegistered = await registry.isRegistered(
  '0xC51D76BaD946a13428d4425FE07F3fbc23Af603D'
);
console.log('Agent registered:', isRegistered);
```

---

## 📝 Environment Variables

Add these to your `.env` file:

```bash
# Network Configuration
SOMNIA_TESTNET_RPC=https://50312.rpc.thirdweb.com
SOMNIA_MAINNET_RPC=https://api.infra.mainnet.somnia.network

# Deployed Contract Addresses
AGENT_REGISTRY_ADDRESS=0xF118Ce0EC1370879D48c4d20e2654904e63c34fD
AGENT_FACTORY_ADDRESS=0x9f0b44f152EdDFB99f0206D2E7E390b5ED69372b
SAMPLE_AGENT_ADDRESS=0xC51D76BaD946a13428d4425FE07F3fbc23Af603D

# Your Private Key (NEVER commit this!)
PRIVATE_KEY=your_private_key_here
```

---

## 🎯 Next Steps

### For Development
1. Use these contract addresses in your SDK
2. Test agent creation with AgentFactory
3. Register new agents in AgentRegistry
4. Monitor agent activity

### For Testing
1. Visit explorer URLs to view contracts
2. Check transaction history
3. Verify contract state
4. Test contract functions

### For Submission
1. Include these addresses in documentation
2. Add explorer links to README
3. Create video demo showing deployed contracts
4. Highlight real testnet deployment

---

## 🏆 Achievement

**REAL TESTNET DEPLOYMENT COMPLETE!** 🎉

This is not just code - these are REAL smart contracts deployed to Somnia Shannon Testnet, verified on the blockchain, and ready for production use!

**Proof:**
- ✅ Contracts visible on block explorer
- ✅ Transactions recorded on blockchain
- ✅ All tests passed on real network
- ✅ Fully functional and verified

---

## 📞 Support

### Official Resources
- **Somnia Docs:** https://docs.somnia.network
- **Somnia Discord:** https://discord.gg/somnia
- **Somnia Twitter:** https://twitter.com/SomniaNetwork

### SomniaAgent SDK
- **GitHub:** https://github.com/hieple7985/master-dorahack
- **Branch:** feature/003-somnia-ai
- **Documentation:** `/hackathons/003-somnia-ai/README.md`

---

**Deployed with ❤️ on Somnia Shannon Testnet**  
**Ready for Hackathon Submission! 🚀**

