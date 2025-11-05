import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying SomniaAgent contracts...");

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy AgentRegistry
  console.log("\n📦 Deploying AgentRegistry...");
  const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
  const registry = await AgentRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("✅ AgentRegistry deployed to:", registryAddress);

  // Deploy AgentFactory
  console.log("\n📦 Deploying AgentFactory...");
  const AgentFactory = await ethers.getContractFactory("AgentFactory");
  const factory = await AgentFactory.deploy(registryAddress);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("✅ AgentFactory deployed to:", factoryAddress);

  // Deploy a sample BaseAgent for testing
  console.log("\n📦 Deploying sample BaseAgent...");
  const BaseAgent = await ethers.getContractFactory("BaseAgent");
  const agent = await BaseAgent.deploy();
  await agent.waitForDeployment();
  const agentAddress = await agent.getAddress();
  console.log("✅ BaseAgent deployed to:", agentAddress);

  // Initialize sample agent
  console.log("\n🔧 Initializing sample agent...");
  const tx = await agent.initialize("SampleAgent", 0); // 0 = DEFI
  await tx.wait();
  console.log("✅ Sample agent initialized");

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("AgentRegistry:", registryAddress);
  console.log("AgentFactory:", factoryAddress);
  console.log("Sample BaseAgent:", agentAddress);
  console.log("=".repeat(60));

  // Save deployment info
  const network = await ethers.provider.getNetwork();
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId), // Convert BigInt to Number
    deployer: deployer.address,
    contracts: {
      AgentRegistry: registryAddress,
      AgentFactory: factoryAddress,
      SampleBaseAgent: agentAddress,
    },
    timestamp: new Date().toISOString(),
  };

  console.log("\n📄 Deployment info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

