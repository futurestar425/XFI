import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers"

describe("XFI Token Test", function () {
    let xfi:Contract;
    let owner: any;
    let user: any;
    
    it("deployment", async function() { // beforeEach(async function() {
        // Get the first account as the owner
        [owner, user] = await ethers.getSigners();
        console.log("\tAccount address\t", await owner.address);

        const XFI = await ethers.getContractFactory("XFI");
        xfi = await XFI.deploy();
        console.log("\tXFI Token address\t", await xfi.getAddress());
    });

    it("get vault name and symbol", async function() {
        console.log("\tToken Name:\t", await xfi.name());
        console.log("\tToken Symbol:\t ", await xfi.symbol());
        console.log("\tToken Decimals:\t ", await xfi.decimals());
        const _totalSupply = await xfi.totalSupply();
        console.log("\tToken total supply:\t ", ethers.formatEther(_totalSupply));

        const ownerBalance = await xfi.balanceOf(owner);
        console.log("\tcontract owner balance :\t ", ethers.formatEther(ownerBalance));
        const userBalance = await xfi.balanceOf('0x344EF98ED26D8E5f2A64E4FcC50bb10672730681');
        console.log("\tuser balance :\t ", ethers.formatEther(userBalance));
    });

});