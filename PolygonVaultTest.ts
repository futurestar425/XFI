import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers"

describe("PolygonVault Test", function () {
    let asset:Contract;
    let xxx: Contract;
    let polygonVault: Contract;
    let factory: Contract;
    let router: Contract;
    let owner: any;
    let user: any;
    let user1: any;
    let user2: any;
    let user3: any;

    const PGT = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const XXX = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const WMATIC = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    
    it("should deploy asset and vault contract", async function() { // beforeEach(async function() {
        // Get the first account as the owner
        [owner, user, user1, user2, user3] = await ethers.getSigners();
        console.log("\tAccount address\t", await owner.address);

        // Deploy the Asset(PolygonToken) token
        const PolygonToken = await ethers.getContractFactory("PolygonToken");
        asset = await PolygonToken.deploy();
        console.log("\tPGT address\t", await asset.getAddress());

        // Deploy the XXX(Vault) token
        const XFI = await ethers.getContractFactory("XFI");
        xxx = await XFI.deploy();
        console.log("\tXXX address\t", await xxx.getAddress());

        // Deploy PolygonVault contract
        const PolygonVault = await ethers.getContractFactory("PolygonVault");
        polygonVault = await PolygonVault.deploy(await asset.getAddress(), "vaultPGT-WMATIC", "vPGT-WMATIC");
        console.log("\tvaultPGT-WMATIC address\t", await polygonVault.getAddress());

        // Deploy QuickswapFactory contract
        const QuickswapFactory = await ethers.getContractFactory("QuickswapFactory");
        let feeToSetter = "0x67CF3bF40b2b3b3D68F6c361AEf81F8AEb2dB637";
        factory = await QuickswapFactory.deploy(feeToSetter);
        console.log("\tQuickswapFactory address\t", await factory.getAddress());

        // Deploy QuickswapFactory contract
        const QuickswapRouter = await ethers.getContractFactory("QuickswapRouter");
        let wethAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
        router = await QuickswapRouter.deploy(await factory.getAddress(), wethAddress);
        console.log("\tQuickswapRouter address\t", await router.getAddress());

        // Mint some tokens for testing
        await asset.mint(await polygonVault.getAddress(), ethers.parseEther("1000"));
        console.log("\tSuccess mint 1000 PGT to vault");
    });

    it("should return the correct vault name and symbol", async function() {
        expect(await polygonVault.getVaultName()).to.equal("vaultPGT-WMATIC");
        expect(await polygonVault.getVaultSymbol()).to.equal("vPGT-WMATIC");
        console.log("\tVault Name:\t", await polygonVault.getVaultName());
        console.log("\tVault Symbol:\t ", await polygonVault.getVaultSymbol());
    });

    it("should deposit assets and update the shareHolder", async function () {
        await asset.approve(await polygonVault.getAddress(), ethers.parseEther("100"));
        await polygonVault._deposit(ethers.parseEther("100"));
        console.log("\tSuccess deposit 100 PGT to vault");
        expect(await polygonVault.shareHolder(owner.address)).to.equal(ethers.parseEther("100"));// share amount minted 100
        console.log("\tSuccess receive 100 vPGT from vault");
    });

    it("should return the total number of assets deposited in the vault", async function () {
        // Check that the totalAssets function returns the correct value
        expect(await polygonVault.totalAssets()).to.equal(ethers.parseEther("1100"));//1000(initial mint amount) + 100
        console.log("\tVault total assets 1100 PGT = 1000(mint) + 100(deposited)");
    });

    it("should return the total balance of a user", async function () {
        // Check that the totalAssetsOfUser function returns the correct value
        expect(await polygonVault.totalAssetsOfUser(owner.address)).to.equal(ethers.parseEther("999999900"));//1000000000(initail mint amount) - 100
        console.log("\tUser total assets 999999900 PGT = 1000000000(mint) - 100(deposited)");
    });

    it("should withdraw assets and update the shareHolder", async function () {
        const shareToWithdraw = ethers.parseEther("50");
        await polygonVault._withdraw(shareToWithdraw, user.address);
        console.log("\tSuccess send 50 vPGT to vault");
        
        // Check that shareHolder mapping was updated correctly
        expect(await polygonVault.shareHolder(owner.address)).to.equal(ethers.parseEther("50"));
        // Check that the user received the contract amount of assets
        expect(await asset.balanceOf(user.address)).to.equal(ethers.parseEther("55"));
        console.log("\tSuccess withdraw 55 PGT from vault (Test APY: 10%)");
    });

    it("should set uniswap v2 factory", async function() {
        let factory = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';
        await polygonVault.setUniswapFactoryAddress(factory);
        console.log("\tuniswap v2 factory address is ", await polygonVault.getUniswapFactoryAddress());
    });

    it("should set uniswap v2 router", async function() {
        let router = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';
        await polygonVault.setUniswapRouterAddress(router);
        console.log("\tuniswap v2 router address is ", await polygonVault.getUniswapRouterAddress());
    });

    it("should set vault name and symbol", async function() {
        await polygonVault.setVaultName("Vault Token Name");
        console.log("\tvault name is ", await polygonVault.getVaultName());

        await polygonVault.setVaultSymbol("VTC");
        console.log("\tvault symbol is ", await polygonVault.getVaultSymbol());
    });

    it("should set several fees like PF, CR, PR", async function () {
        await polygonVault.setPerformanceFee(20);
        console.log("\tPF is ", await polygonVault.getPerformanceFee());

        await polygonVault.setConversionRate(50);
        console.log("\tCR is ", await polygonVault.getConversionRate());

        await polygonVault.setPercentRate(25);
        console.log("\tPR is ", await polygonVault.getPercentRate());
    });

    it("should set token0, token1, xxx, treasury address", async function() {
        await polygonVault.setToken0Address(await asset.getAddress());
        console.log("\ttoken0  address is ", await polygonVault.getToken0Address());

        await polygonVault.setToken1Address(await xxx.getAddress());
        console.log("\ttoken1  address is ", await polygonVault.getToken1Address());

        await polygonVault.setXXXAddress(await xxx.getAddress());
        console.log("\txxx address is ", await polygonVault.getXXXAddress());

        await polygonVault.setTreasuryAddress(await asset.getAddress());
        console.log("\ttreasury  address is ", await polygonVault.getTreasuryAddress());
    });

    it("should add liquidity on uniswapV2 pool", async function () {
        // User -> Vault (tokenA, tokenB), Approve(Vault Address) -> Transfer
        const vaultAddress = await polygonVault.getAddress();
        asset.approve(vaultAddress, 1000000);
        xxx.approve(vaultAddress, 1000000);

        asset.transfer(vaultAddress, 1000000);
        xxx.transfer(vaultAddress, 1000000);

        let a = await asset.balanceOf(vaultAddress);
        let b = await xxx.balanceOf(vaultAddress);

        console.log("\tasset ", a);
        console.log("\txxx ", b);

        // Add liquidity to the pool
        let liquidity = await polygonVault.addLiquidityWithERC20(
            await asset.getAddress(),
            await xxx.getAddress(),
            1000000,
            1000000,
        );

        console.log("\tadd liquidity PGT-XXX - ", typeof(liquidity));
    });

    it("should remove liquidity on uniswap v2 ", async function () {
        let {token0, token1} = await polygonVault.removeLiquidityWithERC20(await asset.getAddress(), await xxx.getAddress(), 1500);
        console.log("\tsuccess remove liquidity", token0, token1);
        
        let a = await asset.balanceOf(await polygonVault.getAddress());
        let b = await xxx.balanceOf(await polygonVault.getAddress());

        console.log("\tasset ", a);
        console.log("\txxx ", b);
    });

    it("should exist pair address for spc and xxx", async function () {
        let pairAddress = await polygonVault.getPairAddress(await asset.getAddress(), await xxx.getAddress());
        console.log("\tPGT-XXX pair address ", pairAddress);
    })

    it("should get reserve amounts for spc and xxx", async function () {
        let {spcAmount, xxxAmount} = await polygonVault.getReserveAmounts(await asset.getAddress(), await xxx.getAddress());
        console.log("\tPGT reserve amount ", spcAmount);
        console.log("\tXXX reserve amount ", xxxAmount);
    });

    it("should deposit asset pair to vault", async function () {
        let vaultLP = await polygonVault.balanceOf(owner.address);
        let uniLP = await polygonVault.getTVL();

        console.log("\tUser original vPGT-WMATIC amount ", vaultLP);
        console.log("\tVault original Uni LP TVL amount ", uniLP);

        // Approve the tokens for transfer
        const vaultAddress = await polygonVault.getAddress();
        
        await asset.approve(vaultAddress, 100000);
        await xxx.approve(vaultAddress, 100000);

        await polygonVault.depositAssetPair(100000, 100000); 

        let userInfo = await polygonVault.getUserInfo(owner);
        console.log("\tuser address ", userInfo._address);
        console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
        console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
        console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
        console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
    });

    it("should preview swap output amount without doing swap ", async function () {
        let output = await polygonVault.previewSwapAmountOut(XXX, PGT, 10000);
        console.log("\tpreview swap input amount 10000");
        console.log("\tpreview swap output amount ", output);
    });

    it("should swap exact token0 for token1 (XXX-PGT) on uniswapV2", async function () {
        // User current status
        let c = await asset.balanceOf(owner.address);
        let d = await xxx.balanceOf(owner.address);

        console.log("\tuser xxx ", d);
        console.log("\tuser asset ", c);
    
        // User -> Vault (XXX -> PGT)
        await xxx.approve(await polygonVault.getAddress(), 10000);
        await xxx.transfer(await polygonVault.getAddress(), 10000);

        // Uniswap -> Vault -> User (asset amountOut)
        let amountOut = await polygonVault.swapExactToken0ForToken1(await xxx.getAddress(), await asset.getAddress(), 10000, 1, owner.address);
        
        // user after status 
        let cc = await asset.balanceOf(owner.address);
        let dd = await xxx.balanceOf(owner.address);

        console.log("\n\tafter user xxx --- ", dd);
        console.log("\tafter user asset +++ ", cc);
    });

    it("should swap token0 for exact token1 (XXX-PGT) on uniswapV2", async function() {
        // User current status
        let c = await asset.balanceOf(owner.address);
        let d = await xxx.balanceOf(owner.address);

        console.log("\tuser xxx ", d);
        console.log("\tuser asset ", c);
    
        // User -> Vault (XXX -> PGT)
        await xxx.approve(await polygonVault.getAddress(), 10000);
        await xxx.transfer(await polygonVault.getAddress(), 10000);

        // User -> Uniswap : xxx 5000  
        // Uniswap -> User : asset 3000 (refund left xxx)
        let amountOut = await polygonVault.swapToken0ForExactToken1(await xxx.getAddress(), await asset.getAddress(), 3000, 5000, owner.address);
        // console.log("\tsuccess swap token0 for exact token1 ", amountOut);
        
        // user after status 
        let cc = await asset.balanceOf(owner.address);
        let dd = await xxx.balanceOf(owner.address);

        console.log("\n\tafter user xxx --- ", dd);
        console.log("\tafter user asset +++ 3000 ", cc);
    });

    it("should calculate total xxx amount and should add liquidity with xxx (Must call first, Vault Initializer) ", async function () {
        let amountXXX1 = await polygonVault.getTotalAmountOfXXXForLiquidity(100000, 1000); //spc-100000, ratio-1:1
        let amountXXX2 = await polygonVault.getTotalAmountOfXXXForLiquidity(100, 1852000); //spc-100, ratio-1:1852
        let totalXXX = amountXXX1 + amountXXX2;
        expect(totalXXX.toString()).to.equal("285200");

        console.log("\tPGT amount : 100000");
        console.log("\ttotal XXX1 amount: ", amountXXX1);
        console.log("\tWMATIC amount: 100");
        console.log("\ttotal XXX2 amount: ", amountXXX2);
        console.log("\ttotal XXX amount: ", totalXXX);
    });

    it("should autoconvert native reward and vault token", async function () {
        let initialVaultPGT = await asset.balanceOf(await polygonVault.getAddress());
        let intiailUserXXX = await xxx.balanceOf(owner.address);

        console.log("\tVault initial PGT amount ", initialVaultPGT);
        console.log("\tUser initial XXX amount ", intiailUserXXX);

        let {amountPGT, amountETH, amountXXX} = await polygonVault.autoConvertNativeRewardToXXX(20000, 20000, owner.address, 50);
        console.log("\tsuccess autoconvert ", amountPGT, amountETH, amountXXX);

        let afterVaultPGT = await asset.balanceOf(await polygonVault.getAddress());
        let afterUserXXX = await xxx.balanceOf(owner.address);

        console.log("\n\tVault after PGT amount ", afterVaultPGT);
        console.log("\tUser after XXX amount ", afterUserXXX);
    });

    it("should get add vault reward as XXX", async function () {
        await polygonVault.calculateAdditionAmountOfXXX(10000, 10000, 25);
        let amountXXX = await polygonVault.getAdditionAmountOfXXX();

        console.log("\tVault addition reward XXX ", amountXXX);
    });

    it("should get vault total reward ", async function () {
        await xxx.mint(await polygonVault.getAddress(), 1000);
        let intiailUserXXX = await xxx.balanceOf(owner.address);
        console.log("\tUser initial XXX amount ", intiailUserXXX);

        let {amountPGT, amountETH, amountXXX} = await polygonVault.getVaultTotalReward(100, 100, owner.address);
        // console.log("\tsuccess get vault total reward ", amountPGT, amountETH, amountXXX);
        
        let afterUserXXX = await xxx.balanceOf(owner.address);
        console.log("\tUser after XXX amount ", afterUserXXX);

        let amount = await polygonVault.getAdditionAmountOfXXX();
        console.log("\n\tVault addition reward XXX ", amount);
    });

    it("should remove liquidity and send APY to user ", async function () {
        await polygonVault.withdrawAssetPair(1000);

        let userInfo = await polygonVault.getUserInfo(owner);
        console.log("\tuser address ", userInfo._address);
        console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
        console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
        console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
        console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
    });

    it("should remove liquidity and send Asset Pair to user ", async function () {
        await polygonVault.withdrawAssetPairToUser(1000);

        let userInfo = await polygonVault.getUserInfo(owner);
        console.log("\tuser address ", userInfo._address);
        console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
        console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
        console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
        console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
    });

    it("should get treasury info ", async function () {
        let {treasury, spcAmount, wethAmount} = await polygonVault.getTreasuryTotalPF(await asset.getAddress(), await xxx.getAddress());
        console.log("\tTreasury address ", treasury);
        console.log("\tTreasury PGT amount ", spcAmount);
        console.log("\tTreasury WMATIC amount ", wethAmount);
    });

    it("should get performance fee from uniswapV2 ", async function () {
        let {token0, token1} = await polygonVault.autoclaimPerformanceFee(await asset.getAddress(), await xxx.getAddress(), 1500);
        console.log("\tsuccess remove liquidity", token0, token1);
        
        let a = await asset.balanceOf(await polygonVault.getAddress());
        let b = await xxx.balanceOf(await polygonVault.getAddress());

        console.log("\tasset ", a);
        console.log("\txxx ", b);
    });

    it("should claim user fee ", async function () {
        await polygonVault.claimUserFee(await asset.getAddress(), await xxx.getAddress(), 1000, owner.address);

        let userInfo = await polygonVault.getUserInfo(owner);
        console.log("\tuser address ", userInfo._address);
        console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
        console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
        console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
        console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
    });

    it("should autoclaim every user fee ", async function () {

        await polygonVault.autoClaimUserFee(await asset.getAddress(), await xxx.getAddress(), 1000);

        let allUser: any[] = await polygonVault.getAllUsers();
        for (let i = 0;  i < allUser.length;  i++) {
            let userInfo = await polygonVault.getUserInfo(allUser[i]._address);
            console.log("\tuser ", i+1 ,"address ", userInfo._address);
            console.log("\tuser ", i+1 ,"_depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
            console.log("\tuser ", i+1 ,"_depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
            console.log("\tuser ", i+1 ,"_lastDepositedTime ", userInfo._lastDepositedTime);
            console.log("\tuser ", i+1 ,"_lastClaimedTime ", userInfo._lastClaimedTime);
        }
    });
    
    it("should add user info (wallet address, depositAmount) ", async function () {
        await polygonVault.addUser(user1.address, 1000, 1000, 1694018928);
        await polygonVault.addUser(user2.address, 2000, 2000, 1694018928);
        // await polygonVault.addUser(user3.address, 3000, 3000);

        let user1Info = await polygonVault.getUserInfo(user1.address);
        let user2Info = await polygonVault.getUserInfo(user2.address);
        let ownerInfo = await polygonVault.getUserInfo(owner.address);
        
        expect(user1Info._depositAmountOfToken0.toString()).to.equal("1000");
        expect(user2Info._depositAmountOfToken0.toString()).to.equal("2000");
        // expect(user3Info._depositAmountOfToken0.toString()).to.equal("3000");

        console.log("\n\tuser1 address : ", user1.address);
        console.log("\tuser1 deposit amount : ", user1Info._depositAmountOfToken0);
        console.log("\n\tuser2 address : ", user2.address);
        console.log("\tuser2 deposit amount : ", user2Info._depositAmountOfToken0);
        // console.log("\n\tuser3 address : ", user3.address);
        // console.log("\tuser3 deposit amount : ", user3Info._depositAmountOfToken0);
        console.log("\n\n\n");

        let allUser: any[] = await polygonVault.getAllUsers();
        for (let i = 0;  i < allUser.length;  i++) {
            console.log("\n\tuser" + i + " address : ", allUser[i]._address);
            console.log("\tuser" + i + " deposit toeken0 amount : ", allUser[i]._depositAmountOfToken0);
        }

        console.log("\tuser1 address is vault user address. - ", await polygonVault.isVaultUser(user1.address));
        console.log("\tuser3 address is vault user address. - ", await polygonVault.isVaultUser(user3.address));

        console.log("\n\towner last deposited time ", ownerInfo._lastDepositedTime);
        console.log("\n\towner last claimed time ", ownerInfo._lastClaimedTime);
    });
});