# Somnia Testnet Deployment Guide

Complete guide for deploying SomniaAgent SDK to Somnia Shannon Testnet.

---

## 📋 Prerequisites

### 1. Network Information

**Somnia Shannon Testnet:**
- **Network Name:** Somnia Shannon Testnet
- **Chain ID:** 50312
- **RPC URL:** https://50312.rpc.thirdweb.com
- **Currency Symbol:** STT (Somnia Test Token)
- **Block Explorer:** https://testnet.somnia.network
- **Faucet:** https://testnet.somnia.network

**Somnia Mainnet (for reference):**
- **Network Name:** Somnia Mainnet
- **Chain ID:** 5031
- **RPC URL:** https://api.infra.mainnet.somnia.network
- **Currency Symbol:** SOMI
- **Block Explorer:** https://somnia.network

### 2. Required Tools

- Node.js >= 18.0.0
- npm or yarn
- MetaMask or compatible wallet
- Git

---

## 🚀 Step-by-Step Deployment

### Step 1: Get Testnet Tokens

#### Option A: Official Faucet
1. Visit https://testnet.somnia.network
2. Click "Get STT" button
3. Connect your wallet
4. Request tokens (0.01 STT/day)

**Note:** The official faucet has a daily limit. If you need more tokens, try the other options below.

#### Option B: Thirdweb Faucet
1. Visit https://thirdweb.com/somnia-shannon-testnet
2. Scroll to "Faucet" section
3. Connect wallet
4. Request tokens

**Tip:** Thirdweb faucet is usually faster but may require social verification.

#### Option C: Google Cloud Faucet
1. Visit https://cloud.google.com/application/web3/faucet/somnia/shannon
2. Enter your wallet address
3. Complete captcha
4. Receive tokens

**Note:** You need at least 0.1 STT for deployment (gas fees). I recommend getting 0.5 STT to have some buffer for testing.

---

### Step 2: Add Somnia Testnet to MetaMask

#### Manual Method
1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Click "Add a network manually"
5. Enter the following:
   - **Network Name:** Somnia Shannon Testnet
   - **RPC URL:** https://50312.rpc.thirdweb.com
   - **Chain ID:** 50312
   - **Currency Symbol:** STT
   - **Block Explorer:** https://testnet.somnia.network
6. Click "Save"

#### Automatic Method (ChainList)
1. Visit https://chainlist.org
2. Search for "Somnia Shannon"
3. Click "Add to MetaMask"
4. Approve in MetaMask

---

### Step 3: Set Up Environment

#### Clone Repository
```bash
git clone https://github.com/hieple7985/master-dorahack.git
cd master-dorahack/hackathons/003-somnia-ai/3_dev
```

#### Install Dependencies
```bash
# Install all packages
npm install

# Or with yarn
yarn install
```

#### Configure Environment
Create `.env` file in `3_dev/` directory:

```bash
# Somnia Network Configuration
SOMNIA_TESTNET_RPC=https://50312.rpc.thirdweb.com
SOMNIA_MAINNET_RPC=https://api.infra.mainnet.somnia.network

# Your Private Key (NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# Optional: Etherscan API Key for verification
ETHERSCAN_API_KEY=your_api_key_here
```

**⚠️ SECURITY WARNING:**
- NEVER commit your `.env` file
- NEVER share your private key
- Use a test wallet for testnet deployment
- Keep your private key secure

#### Get Your Private Key
1. Open MetaMask
2. Click account menu (3 dots)
3. Click "Account Details"
4. Click "Export Private Key"
5. Enter password
6. Copy private key
7. Paste into `.env` file

---

### Step 4: Deploy Smart Contracts

#### Option A: Using Hardhat (Manual)

```bash
cd contracts

# Compile contracts
npx hardhat compile

# Deploy to testnet
npx hardhat run scripts/deploy.ts --network testnet
```

**Expected Output:**
```
Deploying contracts to Somnia Shannon Testnet...

✅ AgentRegistry deployed to: 0x1234567890abcdef...
✅ AgentFactory deployed to: 0x567890abcdef1234...
✅ BaseAgent deployed to: 0x9abcdef123456789...

Deployment complete!
Gas used: ~2,500,000
Cost: ~0.05 STT
```

#### Option B: Using CLI (Automated)

```bash
cd ..

# Deploy using CLI
somniaagent deploy --network testnet
```

**Expected Output:**
```
🚀 Deploy AI Agent to Somnia

🌐 Network: Somnia Shannon Testnet
⛓️  Chain ID: 50312
⛽ Gas Limit: 5,000,000

✅ Connected to network
✅ Balance: 0.5000 STT
✅ AgentRegistry deployed: 0x1234...
✅ AgentFactory deployed: 0x5678...
✅ Agent deployed: 0x9abc...

✅ Deployment Successful!

📋 Contract Addresses:
  AgentRegistry: 0x1234567890abcdef...
  AgentFactory: 0x567890abcdef1234...
  Your Agent: 0x9abcdef123456789...

🔗 Explorer Links:
  https://testnet.somnia.network/address/0x9abc...

💾 Save this information:
  AGENT_ADDRESS=0x9abcdef123456789...
```

---

### Step 5: Verify Deployment

#### Check on Block Explorer
1. Visit https://testnet.somnia.network
2. Enter your contract address
3. Verify contract is deployed
4. Check transaction history

#### Test Agent Functionality
```bash
# Monitor your agent
somniaagent monitor 0x9abc... --network testnet

# List all agents
somniaagent list --network testnet
```

---

### Step 6: Verify Contracts (Optional)

#### Using Hardhat
```bash
cd contracts

npx hardhat verify --network testnet \
  0x9abcdef123456789... \
  "MyAgent" \
  0
```

#### Manual Verification
1. Visit https://testnet.somnia.network
2. Go to your contract address
3. Click "Verify & Publish"
4. Select compiler version (0.8.20)
5. Paste contract code
6. Submit

---

## 🧪 Testing on Testnet

### Test Scenario 1: Simple Transaction
```bash
# Create a test agent
somniaagent init --name TestAgent --template defi-trading

# Test locally first
cd TestAgent
somniaagent test --scenario normal_trading

# Deploy to testnet
somniaagent deploy --network testnet

# Monitor
somniaagent monitor <AGENT_ADDRESS> --network testnet
```

### Test Scenario 2: Market Volatility
```bash
# Test with volatility scenario
somniaagent test --scenario market_volatility --duration 120

# If successful, deploy
somniaagent deploy --network testnet
```

### Test Scenario 3: Multiple Agents
```bash
# Deploy multiple agents
somniaagent init --name Agent1 --template defi-trading
cd Agent1
somniaagent deploy --network testnet

cd ..
somniaagent init --name Agent2 --template defi-trading
cd Agent2
somniaagent deploy --network testnet

# List all agents
somniaagent list --network testnet
```

---

## 📊 Monitoring & Debugging

### Real-Time Monitoring
```bash
# Monitor specific agent
somniaagent monitor 0x9abc... --network testnet --interval 5

# Watch for events
somniaagent monitor 0x9abc... --network testnet --verbose
```

### Check Logs
```bash
# View agent logs
tail -f ~/.somniaagent/logs/agent-0x9abc.log

# View deployment logs
tail -f ~/.somniaagent/logs/deployment.log
```

### Debug Issues
```bash
# Check network connection
curl https://50312.rpc.thirdweb.com \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Check balance
somniaagent balance --network testnet

# Check agent status
somniaagent status 0x9abc... --network testnet
```

---

## 💰 Gas Costs

### Estimated Gas Costs (Testnet)

| Operation | Gas Used | Cost (STT) |
|-----------|----------|------------|
| Deploy AgentRegistry | ~800,000 | ~0.016 |
| Deploy AgentFactory | ~600,000 | ~0.012 |
| Deploy BaseAgent | ~1,000,000 | ~0.020 |
| Execute Action | ~50,000 | ~0.001 |
| Update Status | ~30,000 | ~0.0006 |

**Total Deployment Cost:** ~0.05 STT

**Note:** Testnet tokens are free from faucet!

---

## 🔧 Troubleshooting

### Issue 1: Insufficient Funds
```
Error: insufficient funds for gas * price + value
```

**Solution:**
- Get more STT from faucet (you need at least 0.1 STT)
- Wait 24 hours for daily limit reset
- Try multiple faucets (I usually use Thirdweb + Google Cloud together)

**Personal note:** I've found that having 0.5 STT is a good buffer for testing multiple deployments.

### Issue 2: Network Connection Failed
```
Error: could not detect network
```

**Solution:**
- Check RPC URL is correct: `https://50312.rpc.thirdweb.com`
- Try alternative RPC: `https://testnet.somnia.network/rpc` (sometimes more stable)
- Check internet connection
- Verify chain ID is exactly `50312` (not 5031 which is mainnet)

**Tip:** If one RPC is slow, switch to the other. I've noticed Thirdweb RPC is faster during US hours.

### Issue 3: Nonce Too Low
```
Error: nonce has already been used
```

**Solution:**
- Reset MetaMask account (Settings > Advanced > Reset Account)
- Wait for pending transactions to complete
- Manually set nonce in transaction

**Note:** This usually happens when you have multiple pending transactions. Just wait a minute and try again.

### Issue 4: Contract Deployment Failed
```
Error: transaction failed
```

**Solution:**
- Increase gas limit (try 6,000,000 instead of default 5,000,000)
- Check contract code for errors (run `npx hardhat compile` first)
- Verify Solidity version is 0.8.20
- Check constructor parameters are correct

**Common mistake:** Make sure you're not trying to deploy to mainnet by accident. Always double-check the network!

---

## 📝 Best Practices

### Security
- ✅ Use separate wallet for testnet
- ✅ Never commit private keys
- ✅ Use environment variables
- ✅ Keep `.env` in `.gitignore`
- ✅ Verify contracts after deployment

### Testing
- ✅ Test locally first
- ✅ Test on testnet before mainnet
- ✅ Use multiple test scenarios
- ✅ Monitor gas usage
- ✅ Check all edge cases

### Deployment
- ✅ Compile contracts before deploy
- ✅ Verify network configuration
- ✅ Check balance before deploy
- ✅ Save contract addresses
- ✅ Verify on block explorer

---

## 🎯 Next Steps

After successful testnet deployment:

1. **Test Thoroughly**
   - Run all test scenarios
   - Monitor for 24-48 hours
   - Check gas optimization
   - Verify all features work

2. **Document Results**
   - Save contract addresses
   - Record gas costs
   - Screenshot block explorer
   - Note any issues

3. **Prepare for Mainnet**
   - Review security
   - Optimize gas usage
   - Update documentation
   - Get mainnet tokens

4. **Create Demo**
   - Record video demo
   - Show deployment process
   - Demonstrate features
   - Highlight benefits

---

## 📞 Support

### Official Resources
- **Somnia Docs:** https://docs.somnia.network
- **Somnia Discord:** https://discord.gg/somnia
- **Somnia Twitter:** https://twitter.com/SomniaNetwork

### SomniaAgent SDK
- **GitHub:** https://github.com/hieple7985/master-dorahack
- **Issues:** https://github.com/hieple7985/master-dorahack/issues
- **Documentation:** `/hackathons/003-somnia-ai/README.md`

### Get Help
- Open GitHub issue
- Ask in Somnia Discord (#dev-chat)
- Check documentation
- Review examples

---

**Good luck with your deployment! 🚀**

