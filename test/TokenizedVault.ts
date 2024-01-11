import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe.only("Token", function () {
    async function deployToken() {

        // Contracts are deployed using the first signer/account by default
        const [owner, account1, account2] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("Token");
        const token = await Token.deploy();
        console.log("Token: ", await token.target);

        const Strategy = await ethers.getContractFactory("Strategy");
        const strategy = await Strategy.deploy();
        console.log("Strategy: ", await strategy.target);

        let maxSpendPerc = 60;
        const TokenizedVault = await ethers.getContractFactory("TokenizedVault");
        const tokenizedVault = await upgrades.deployProxy(
            TokenizedVault,
            [token.target, maxSpendPerc, strategy.target],
            {
                initializer: "__TokenizedVault_init"
            }
        );
        // await tokenizedVault.waitForDeployment();
        console.log("tokenizedVault: ", await tokenizedVault.target);

        await token.mint(owner, 1000);
        await token.mint(account1, 1000);
        await token.mint(account2, 1000);

        return { token, strategy, tokenizedVault, owner, account1, account2 };
    }

    describe("TokenizedVault", function () {
        it("Should invest correctly", async function () {
            const { token, strategy, tokenizedVault, account1, account2 } = await loadFixture(deployToken);

            console.log("Balance: ", await token.balanceOf(account1.address));
            expect(await token.balanceOf(account1.address)).to.equal(1000);

            // here owner is depositing for other accounts
            await token.approve(tokenizedVault.target, 1000);
            await tokenizedVault.deposit(100, account1.address);
            await tokenizedVault.deposit(100, account2.address);

            console.log("shares minted for account1: ", await tokenizedVault.balanceOf(account1.address));
            console.log("shares minted for account2: ", await tokenizedVault.balanceOf(account2.address));

            let investAmount = 100;
            // we can invest upto 60% of 200 = 120 tokens
            // so 1st invest of 100 tokens will succeed
            await tokenizedVault.invest(investAmount, strategy.interface.encodeFunctionData("depositFromVault", [token.target, investAmount]));
            console.log("totalAssets: ", await tokenizedVault.totalAssets());
            console.log("totalDepositedAsset: ", await tokenizedVault.totalDepositedAsset());
            console.log("reserveFundAvailable: ", await tokenizedVault.reserveFundAvailable());

            // owner can invest max 20 tokens now
            // so this txn will fail as owner is investing 100 tokens
            await expect(
                tokenizedVault.invest(investAmount, strategy.interface.encodeFunctionData("depositFromVault", [token.target, investAmount]))
            ).to.be.revertedWithCustomError({interface: tokenizedVault.interface}, "MaxSpendLimitReached()");

        });

    });


});