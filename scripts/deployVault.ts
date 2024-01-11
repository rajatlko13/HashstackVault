import { ethers, upgrades } from "hardhat";

async function main() {

  const token = await ethers.deployContract("Token");
  await token.waitForDeployment();
  console.log("Token deployed to:", token.target);

  const strategy = await ethers.deployContract("Strategy");
  await strategy.waitForDeployment();
  console.log("Strategy deployed to:", strategy.target);

  let maxSpendPerc = 60;
  const TokenizedVault = await ethers.getContractFactory("TokenizedVault");
  const tokenizedVault = await upgrades.deployProxy(
      TokenizedVault, 
      [token.target, maxSpendPerc, strategy.target],
      {
        initializer: "__TokenizedVault_init"
      }
    );
  await tokenizedVault.waitForDeployment();
  console.log("TokenizedVault deployed to:", await tokenizedVault.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});