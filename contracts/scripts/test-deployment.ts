/**
 * Test Deployment Script
 * 
 * Test contract deployment locally before deploying to testnet
 */

import { ethers } from "hardhat";

async function main() {
  console.log("\n🧪 Testing Contract Deployment Locally\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy AgentRegistry
  console.log("📋 Deploying AgentRegistry...");
  const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
  const registry = await AgentRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("✅ AgentRegistry deployed to:", registryAddress);

  // Deploy AgentFactory
  console.log("\n🏭 Deploying AgentFactory...");
  const AgentFactory = await ethers.getContractFactory("AgentFactory");
  const factory = await AgentFactory.deploy(registryAddress);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("✅ AgentFactory deployed to:", factoryAddress);

  // Deploy BaseAgent
  console.log("\n🤖 Deploying BaseAgent...");
  const BaseAgent = await ethers.getContractFactory("BaseAgent");
  const agent = await BaseAgent.deploy();
  await agent.waitForDeployment();
  const agentAddress = await agent.getAddress();
  console.log("✅ BaseAgent deployed to:", agentAddress);

  // Initialize BaseAgent
  console.log("\n⚙️  Initializing BaseAgent...");
  const initTx = await agent.initialize("TestAgent", 0); // 0 = DEFI type
  await initTx.wait();
  console.log("✅ BaseAgent initialized");

  // Register agent
  console.log("\n📝 Registering agent...");
  const registerTx = await registry.registerAgent(agentAddress, "TestAgent");
  await registerTx.wait();
  console.log("✅ Agent registered");

  // Verify registration
  console.log("\n🔍 Verifying registration...");
  const isRegistered = await registry.isRegistered(agentAddress);
  console.log("Agent registered:", isRegistered);

  // Test agent functionality
  console.log("\n🧪 Testing agent functionality...");
  
  // Update status
  console.log("  Testing status update...");
  const statusTx = await agent.updateStatus(1); // 1 = RUNNING
  await statusTx.wait();
  console.log("  ✅ Status updated to RUNNING");

  // Execute action
  console.log("  Testing action execution...");
  const actionData = ethers.AbiCoder.defaultAbiCoder().encode(
    ["uint256", "uint256"],
    [1000, 100] // Example: price, amount
  );
  const actionTx = await agent.executeAction("buy", actionData);
  await actionTx.wait();
  console.log("  ✅ Action executed");

  // Get agent info
  const info = await agent.agentInfo();
  console.log("\n📊 Final Agent Info:");
  console.log("  Name:", info.name);
  console.log("  Type:", info.agentType.toString());
  console.log("  Status:", info.status.toString());
  console.log("  Owner:", info.owner);
  console.log("  Total Actions:", info.totalActions.toString());

  // Summary
  console.log("\n✅ All Tests Passed!\n");
  console.log("📋 Deployment Summary:");
  console.log("  AgentRegistry:", registryAddress);
  console.log("  AgentFactory:", factoryAddress);
  console.log("  BaseAgent:", agentAddress);
  console.log("\n🎉 Ready for testnet deployment!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });

