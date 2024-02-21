import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers"

describe("TokenVault Test", function () {
    let asset:Contract;
    let xxx: Contract;
    let tokenVault: Contract;
    let factory: Contract;
    let router: Contract;
    let owner: any;
    let user: any;
    let user1: any;
    let user2: any;
    let user3: any;

    const SPC = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const XXX = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const WETH = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    
    it("should deploy asset and vault contract", async function() { // beforeEach(async function() {
        // Get the first account as the owner
        [owner, user, user1, user2, user3] = await ethers.getSigners();
        console.log("\tAccount address\t", await owner.address);

        // Deploy the Asset(SpaceCredit) token
        const SpaceCredit = await ethers.getContractFactory("SpaceCredit");
        asset = await SpaceCredit.deploy();
        console.log("\tSPC address\t", await asset.getAddress());

        // Deploy the XXX(Vault) token
        const XFI = await ethers.getContractFactory("XFI");
        xxx = await XFI.deploy();
        console.log("\tXXX address\t", await xxx.getAddress());

        // Deploy TokenVault contract
        const TokenVault = await ethers.getContractFactory("TokenVault");
        tokenVault = await TokenVault.deploy(await asset.getAddress(), "vaultSPC-WETH", "vSPC-WETH");
        console.log("\tvaultSPC-WETH address\t", await tokenVault.getAddress());

        // Deploy UniswapV2Factory contract
        const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
        let feeToSetter = "0x67CF3bF40b2b3b3D68F6c361AEf81F8AEb2dB637";
        factory = await UniswapV2Factory.deploy(feeToSetter);
        console.log("\tUniswapV2Factory address\t", await factory.getAddress());

        // Deploy UniswapV2Factory contract
        const UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");
        let wethAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
        router = await UniswapV2Router02.deploy(await factory.getAddress(), wethAddress);
        console.log("\tUniswapV2Router02 address\t", await router.getAddress());

        // Mint some tokens for testing
        await asset.mint(await tokenVault.getAddress(), ethers.parseEther("1000"));
        console.log("\tSuccess mint 1000 SPC to vault");
    });

    it("should return the correct vault name and symbol", async function() {
        expect(await tokenVault.getVaultName()).to.equal("vaultSPC-WETH");
        expect(await tokenVault.getVaultSymbol()).to.equal("vSPC-WETH");
        console.log("\tVault Name:\t", await tokenVault.getVaultName());
        console.log("\tVault Symbol:\t ", await tokenVault.getVaultSymbol());
    });

    it("should deposit assets and update the shareHolder", async function () {
        await asset.approve(await tokenVault.getAddress(), ethers.parseEther("100"));
        await tokenVault._deposit(ethers.parseEther("100"));
        console.log("\tSuccess deposit 100 SPC to vault");
        expect(await tokenVault.shareHolder(owner.address)).to.equal(ethers.parseEther("100"));// share amount minted 100
        console.log("\tSuccess receive 100 vSPC from vault");
    });

    it("should return the total number of assets deposited in the vault", async function () {
        // Check that the totalAssets function returns the correct value
        expect(await tokenVault.totalAssets()).to.equal(ethers.parseEther("1100"));//1000(initial mint amount) + 100
        console.log("\tVault total assets 1100 SPC = 1000(mint) + 100(deposited)");
    });

    it("should return the total balance of a user", async function () {
        // Check that the totalAssetsOfUser function returns the correct value
        expect(await tokenVault.totalAssetsOfUser(owner.address)).to.equal(ethers.parseEther("999999900"));//1000000000(initail mint amount) - 100
        console.log("\tUser total assets 999999900 SPC = 1000000000(mint) - 100(deposited)");
    });

    it("should withdraw assets and update the shareHolder", async function () {
        const shareToWithdraw = ethers.parseEther("50");
        await tokenVault._withdraw(shareToWithdraw, user.address);
        console.log("\tSuccess send 50 vSPC to vault");
        
        // Check that shareHolder mapping was updated correctly
        expect(await tokenVault.shareHolder(owner.address)).to.equal(ethers.parseEther("50"));
        // Check that the user received the contract amount of assets
        expect(await asset.balanceOf(user.address)).to.equal(ethers.parseEther("55"));
        console.log("\tSuccess withdraw 55 SPC from vault (Test APY: 10%)");
    });

    it("should set uniswap v2 factory", async function() {
        let factory = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';
        await tokenVault.setUniswapFactoryAddress(factory);
        console.log("\tuniswap v2 factory address is ", await tokenVault.getUniswapFactoryAddress());
    });

    it("should set uniswap v2 router", async function() {
        let router = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';
        await tokenVault.setUniswapRouterAddress(router);
        console.log("\tuniswap v2 router address is ", await tokenVault.getUniswapRouterAddress());
    });

    it("should set vault name and symbol", async function() {
        await tokenVault.setVaultName("Vault Token Name");
        console.log("\tvault name is ", await tokenVault.getVaultName());

        await tokenVault.setVaultSymbol("VTC");
        console.log("\tvault symbol is ", await tokenVault.getVaultSymbol());
    });

    it("should set several fees like PF, CR, PR", async function () {
        await tokenVault.setPerformanceFee(20);
        console.log("\tPF is ", await tokenVault.getPerformanceFee());

        await tokenVault.setConversionRate(50);
        console.log("\tCR is ", await tokenVault.getConversionRate());

        await tokenVault.setPercentRate(25);
        console.log("\tPR is ", await tokenVault.getPercentRate());
    });

    it("should set token0, token1, xxx, treasury address", async function() {
        await tokenVault.setToken0Address(await asset.getAddress());
        console.log("\ttoken0  address is ", await tokenVault.getToken0Address());

        await tokenVault.setToken1Address(await xxx.getAddress());
        console.log("\ttoken1  address is ", await tokenVault.getToken1Address());

        await tokenVault.setXXXAddress(await xxx.getAddress());
        console.log("\txxx address is ", await tokenVault.getXXXAddress());

        await tokenVault.setTreasuryAddress(await asset.getAddress());
        console.log("\ttreasury  address is ", await tokenVault.getTreasuryAddress());
    });

    it("should add liquidity on uniswapV2 pool", async function () {
        // User -> Vault (tokenA, tokenB), Approve(Vault Address) -> Transfer
        const vaultAddress = await tokenVault.getAddress();
        asset.approve(vaultAddress, 1000000);
        xxx.approve(vaultAddress, 1000000);

        asset.transfer(vaultAddress, 1000000);
        xxx.transfer(vaultAddress, 1000000);

        let a = await asset.balanceOf(vaultAddress);
        let b = await xxx.balanceOf(vaultAddress);

        console.log("\tasset ", a);
        console.log("\txxx ", b);

        // Add liquidity to the pool
        let liquidity = await tokenVault.addLiquidityWithERC20(
            await asset.getAddress(),
            await xxx.getAddress(),
            1000000,
            1000000,
        );

        console.log("\tadd liquidity SPC-XXX - ", typeof(liquidity));
    });

    it("should remove liquidity on uniswap v2 ", async function () {
        let {token0, token1} = await tokenVault.removeLiquidityWithERC20(await asset.getAddress(), await xxx.getAddress(), 1500);
        console.log("\tsuccess remove liquidity", token0, token1);
        
        let a = await asset.balanceOf(await tokenVault.getAddress());
        let b = await xxx.balanceOf(await tokenVault.getAddress());

        console.log("\tasset ", a);
        console.log("\txxx ", b);
    });

    it("should exist pair address for spc and xxx", async function () {
        let pairAddress = await tokenVault.getPairAddress(await asset.getAddress(), await xxx.getAddress());
        console.log("\tSPC-XXX pair address ", pairAddress);
    })

    it("should get reserve amounts for spc and xxx", async function () {
        let {spcAmount, xxxAmount} = await tokenVault.getReserveAmounts(await asset.getAddress(), await xxx.getAddress());
        console.log("\tSPC reserve amount ", spcAmount);
        console.log("\tXXX reserve amount ", xxxAmount);
    });

    it("should deposit asset pair to vault", async function () {
        let vaultLP = await tokenVault.balanceOf(owner.address);
        let uniLP = await tokenVault.getTVL();

        console.log("\tUser original vSPC-WETH amount ", vaultLP);
        console.log("\tVault original Uni LP TVL amount ", uniLP);

        // Approve the tokens for transfer
        const vaultAddress = await tokenVault.getAddress();
        
        await asset.approve(vaultAddress, 100000);
        await xxx.approve(vaultAddress, 100000);

        await tokenVault.depositAssetPair(100000, 100000); 

        let userInfo = await tokenVault.getUserInfo(owner);
        console.log("\tuser address ", userInfo._address);
        console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
        console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
        console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
        console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
    });

    it("should preview swap output amount without doing swap ", async function () {
        let output = await tokenVault.previewSwapAmountOut(XXX, SPC, 10000);
        console.log("\tpreview swap input amount 10000");
        console.log("\tpreview swap output amount ", output);
    });

    it("should swap exact token0 for token1 (XXX-SPC) on uniswapV2", async function () {
        // User current status
        let c = await asset.balanceOf(owner.address);
        let d = await xxx.balanceOf(owner.address);

        console.log("\tuser xxx ", d);
        console.log("\tuser asset ", c);
    
        // User -> Vault (XXX -> SPC)
        await xxx.approve(await tokenVault.getAddress(), 10000);
        await xxx.transfer(await tokenVault.getAddress(), 10000);

        // Uniswap -> Vault -> User (asset amountOut)
        let amountOut = await tokenVault.swapExactToken0ForToken1(await xxx.getAddress(), await asset.getAddress(), 10000, 1, owner.address);
        
        // user after status 
        let cc = await asset.balanceOf(owner.address);
        let dd = await xxx.balanceOf(owner.address);

        console.log("\n\tafter user xxx --- ", dd);
        console.log("\tafter user asset +++ ", cc);
    });

    it("should swap token0 for exact token1 (XXX-SPC) on uniswapV2", async function() {
        // User current status
        let c = await asset.balanceOf(owner.address);
        let d = await xxx.balanceOf(owner.address);

        console.log("\tuser xxx ", d);
        console.log("\tuser asset ", c);
    
        // User -> Vault (XXX -> SPC)
        await xxx.approve(await tokenVault.getAddress(), 10000);
        await xxx.transfer(await tokenVault.getAddress(), 10000);

        // User -> Uniswap : xxx 5000  
        // Uniswap -> User : asset 3000 (refund left xxx)
        let amountOut = await tokenVault.swapToken0ForExactToken1(await xxx.getAddress(), await asset.getAddress(), 3000, 5000, owner.address);
        // console.log("\tsuccess swap token0 for exact token1 ", amountOut);
        
        // user after status 
        let cc = await asset.balanceOf(owner.address);
        let dd = await xxx.balanceOf(owner.address);

        console.log("\n\tafter user xxx --- ", dd);
        console.log("\tafter user asset +++ 3000 ", cc);
    });

    it("should calculate total xxx amount and should add liquidity with xxx (Must call first, Vault Initializer) ", async function () {
        let amountXXX1 = await tokenVault.getTotalAmountOfXXXForLiquidity(100000, 1000); //spc-100000, ratio-1:1
        let amountXXX2 = await tokenVault.getTotalAmountOfXXXForLiquidity(100, 1852000); //spc-100, ratio-1:1852
        let totalXXX = amountXXX1 + amountXXX2;
        expect(totalXXX.toString()).to.equal("285200");

        console.log("\tSPC amount : 100000");
        console.log("\ttotal XXX1 amount: ", amountXXX1);
        console.log("\tWETH amount: 100");
        console.log("\ttotal XXX2 amount: ", amountXXX2);
        console.log("\ttotal XXX amount: ", totalXXX);
    });

    it("should autoconvert native reward and vault token", async function () {
        let initialVaultSPC = await asset.balanceOf(await tokenVault.getAddress());
        let intiailUserXXX = await xxx.balanceOf(owner.address);

        console.log("\tVault initial SPC amount ", initialVaultSPC);
        console.log("\tUser initial XXX amount ", intiailUserXXX);

        let {amountSPC, amountETH, amountXXX} = await tokenVault.autoConvertNativeRewardToXXX(20000, 20000, owner.address, 50);
        console.log("\tsuccess autoconvert ", amountSPC, amountETH, amountXXX);

        let afterVaultSPC = await asset.balanceOf(await tokenVault.getAddress());
        let afterUserXXX = await xxx.balanceOf(owner.address);

        console.log("\n\tVault after SPC amount ", afterVaultSPC);
        console.log("\tUser after XXX amount ", afterUserXXX);
    });

    it("should get add vault reward as XXX", async function () {
        await tokenVault.calculateAdditionAmountOfXXX(10000, 10000, 25);
        let amountXXX = await tokenVault.getAdditionAmountOfXXX();

        console.log("\tVault addition reward XXX ", amountXXX);
    });

    it("should get vault total reward ", async function () {
        await xxx.mint(await tokenVault.getAddress(), 1000);
        let intiailUserXXX = await xxx.balanceOf(owner.address);
        console.log("\tUser initial XXX amount ", intiailUserXXX);

        let {amountSPC, amountETH, amountXXX} = await tokenVault.getVaultTotalReward(100, 100, owner.address);
        // console.log("\tsuccess get vault total reward ", amountSPC, amountETH, amountXXX);
        
        let afterUserXXX = await xxx.balanceOf(owner.address);
        console.log("\tUser after XXX amount ", afterUserXXX);

        let amount = await tokenVault.getAdditionAmountOfXXX();
        console.log("\n\tVault addition reward XXX ", amount);
    });

    it("should remove liquidity and send APY to user ", async function () {
        await tokenVault.withdrawAssetPair(1000);

        let userInfo = await tokenVault.getUserInfo(owner);
        console.log("\tuser address ", userInfo._address);
        console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
        console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
        console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
        console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
    });

    it("should remove liquidity and send Asset Pair to user ", async function () {
        await tokenVault.withdrawAssetPairToUser(1000);

        let userInfo = await tokenVault.getUserInfo(owner);
        console.log("\tuser address ", userInfo._address);
        console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
        console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
        console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
        console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
    });

    it("should get treasury info ", async function () {
        let {treasury, spcAmount, wethAmount} = await tokenVault.getTreasuryTotalPF(await asset.getAddress(), await xxx.getAddress());
        console.log("\tTreasury address ", treasury);
        console.log("\tTreasury SPC amount ", spcAmount);
        console.log("\tTreasury WETH amount ", wethAmount);
    });

    it("should get performance fee from uniswapV2 ", async function () {
        let {token0, token1} = await tokenVault.autoclaimPerformanceFee(await asset.getAddress(), await xxx.getAddress(), 1500);
        console.log("\tsuccess remove liquidity", token0, token1);
        
        let a = await asset.balanceOf(await tokenVault.getAddress());
        let b = await xxx.balanceOf(await tokenVault.getAddress());

        console.log("\tasset ", a);
        console.log("\txxx ", b);
    });

    it("should claim user fee ", async function () {
        await tokenVault.claimUserFee(await asset.getAddress(), await xxx.getAddress(), 1000, owner.address);

        let userInfo = await tokenVault.getUserInfo(owner);
        console.log("\tuser address ", userInfo._address);
        console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
        console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
        console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
        console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
    });

    it("should autoclaim every user fee ", async function () {

        await tokenVault.autoClaimUserFee(await asset.getAddress(), await xxx.getAddress(), 1000);

        let allUser: any[] = await tokenVault.getAllUsers();
        for (let i = 0;  i < allUser.length;  i++) {
            let userInfo = await tokenVault.getUserInfo(allUser[i]._address);
            console.log("\tuser ", i+1 ,"address ", userInfo._address);
            console.log("\tuser ", i+1 ,"_depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
            console.log("\tuser ", i+1 ,"_depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
            console.log("\tuser ", i+1 ,"_lastDepositedTime ", userInfo._lastDepositedTime);
            console.log("\tuser ", i+1 ,"_lastClaimedTime ", userInfo._lastClaimedTime);
        }
    });
    
    it("should add user info (wallet address, depositAmount) ", async function () {
        await tokenVault.addUser(user1.address, 1000, 1000, 1694018928);
        await tokenVault.addUser(user2.address, 2000, 2000, 1694018928);
        // await tokenVault.addUser(user3.address, 3000, 3000);

        let user1Info = await tokenVault.getUserInfo(user1.address);
        let user2Info = await tokenVault.getUserInfo(user2.address);
        let ownerInfo = await tokenVault.getUserInfo(owner.address);
        
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

        let allUser: any[] = await tokenVault.getAllUsers();
        for (let i = 0;  i < allUser.length;  i++) {
            console.log("\n\tuser" + i + " address : ", allUser[i]._address);
            console.log("\tuser" + i + " deposit toeken0 amount : ", allUser[i]._depositAmountOfToken0);
        }

        console.log("\tuser1 address is vault user address. - ", await tokenVault.isVaultUser(user1.address));
        console.log("\tuser3 address is vault user address. - ", await tokenVault.isVaultUser(user3.address));

        console.log("\n\towner last deposited time ", ownerInfo._lastDepositedTime);
        console.log("\n\towner last claimed time ", ownerInfo._lastClaimedTime);
    });
});