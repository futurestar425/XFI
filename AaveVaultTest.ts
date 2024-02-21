import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers"

describe("Aave Vault Test", function () {
    let asset:Contract;
    let xxx: Contract;
    let aaveVault: Contract;
    let owner: any;
    let user: any;
    let user1: any;
    let user2: any;
    let user3: any;
    
    it("deployment", async function() { // beforeEach(async function() {
        // Get the first account as the owner
        [owner, user, user1, user2, user3] = await ethers.getSigners();
        console.log("\tAccount address\t", await owner.address);

        const AssetToken = await ethers.getContractFactory("SpaceCredit");
        asset = await AssetToken.deploy();
        console.log("\tTetherToken address\t", await asset.getAddress());

        const XFI = await ethers.getContractFactory("XFI");
        xxx = await XFI.deploy();
        console.log("\tXXX address\t", await xxx.getAddress());

        // Deploy Aave Vault contract
        const AaveVault = await ethers.getContractFactory("AaveVault");
        aaveVault = await AaveVault.deploy(await asset.getAddress(), "vaultUSDT", "xUSDT");
        console.log("\tvaultUSDT address\t", await aaveVault.getAddress());
    });

    it("get vault name and symbol", async function() {
        expect(await aaveVault.getVaultName()).to.equal("vaultUSDT");
        expect(await aaveVault.getVaultSymbol()).to.equal("xUSDT");
        console.log("\tVault Name:\t", await aaveVault.getVaultName());
        console.log("\tVault Symbol:\t ", await aaveVault.getVaultSymbol());
    });

    it("get total asset amount of vault and user", async function() {
        expect((await aaveVault.totalAssets()).toString()).to.equal("0");
        expect((await aaveVault.totalAssetsOfUser(owner)).toString()).to.equal("1000000000000000000000000000");
        console.log("\tinitial asset amount of user:\t", await aaveVault.totalAssetsOfUser(owner));
        console.log("\tinitial asset amount of vault:\t", await aaveVault.totalAssets());
    });

    it("should deposit assets and update the balanceOfShare", async function () {
        await asset.approve(await aaveVault.getAddress(), ethers.parseEther("100"));
        await aaveVault._deposit(ethers.parseEther("100"));
        expect(await aaveVault.balanceOfShare(owner)).to.equal(ethers.parseEther("100"));
        console.log("\tuser share amount\t", await aaveVault.balanceOfShare(owner));
    });

    it("should withdraw assets and update the balanceOfShare", async function () {
        const shareToWithdraw = ethers.parseEther("50");
        await aaveVault._withdraw(shareToWithdraw, user.address);
        
        // Check that balanceOfShare mapping was updated correctly
        expect(await aaveVault.balanceOfShare(owner.address)).to.equal(ethers.parseEther("50"));
        // Check that the user received the contract amount of assets
        expect(await asset.balanceOf(user.address)).to.equal(ethers.parseEther("55"));
        console.log("\tSuccess withdraw 55 xUSDT from vault (Test APY: 10%)");
    });

});