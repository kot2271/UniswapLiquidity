import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract, ContractTransaction, ContractReceipt  } from "ethers";
import { ethers } from "hardhat";
import { Address } from 'cluster';

import { AddLiquidity } from "../src/types/AddLiquidity";
import { AddLiquidity__factory } from "../src/types/factories/AddLiquidity__factory";

const CONTRACT_NAME = "AddLiquidity";

describe("AddLiquidity contract", function () {
    let addLiquidityContract: AddLiquidity;
    let tokenA: Contract;
    let tokenB: Contract;
    let owner: SignerWithAddress;
    const INITIAL_AMOUNT: BigNumber = ethers.utils.parseUnits("10", "18");

    beforeEach(async () => {

        const PizzaToken = await ethers.getContractFactory("PizzaToken");
        tokenA = await PizzaToken.deploy(); 

        const SushiToken = await ethers.getContractFactory("SushiToken");
        tokenB = await SushiToken.deploy();

        // const LiquidityContract = await ethers.getContractFactory(CONTRACT_NAME);
        // addLiquidityContract = await LiquidityContract.deploy();

        [owner] = await ethers.getSigners();

        const addLiquidityFactory = (await ethers.getContractFactory(
          CONTRACT_NAME, owner)) as AddLiquidity__factory;
          addLiquidityContract = await addLiquidityFactory.deploy();

      });

    describe("Initial params of token contracts", async () => {

      it("Initializes name, symbol and decimals correctly", async () => {
          expect(await tokenA.name()).to.equal("PizzaToken");
          expect(await tokenA.symbol()).to.equal("PiToken");
          expect(await tokenA.decimals()).to.equal(18);

          expect(await tokenB.name()).to.equal("SushiToken");
          expect(await tokenB.symbol()).to.equal("SuToken");
          expect(await tokenB.decimals()).to.equal(18);
          });
    
      it("should have the correct owner", async () => {
          expect(await tokenA.owner()).to.equal(owner.address);
          expect(await tokenB.owner()).to.equal(owner.address);
          });
         
      it("should have the correct initial total supply", async () => {
          expect(await tokenA.totalSupply()).to.equal(INITIAL_AMOUNT);
          expect(await tokenB.totalSupply()).to.equal(INITIAL_AMOUNT);
          });
    
      it("should have the correct initial balance for the owner", async () => {
            expect(await tokenA.balanceOf(owner.address)).to.equal(INITIAL_AMOUNT);
            expect(await tokenB.balanceOf(owner.address)).to.equal(INITIAL_AMOUNT);
            });
      });

    describe("Contract logic", function () {

      describe("addLiquidity function", async () => {

        it.only("should adds liquidity correctly", async () => {
            const amountA = ethers.utils.parseEther("1")
            const amountB = ethers.utils.parseEther("2")

            await tokenA.approve(addLiquidityContract.address, amountA);
            await tokenB.approve(addLiquidityContract.address, amountB);
            const tx: ContractTransaction = await addLiquidityContract.addLiquidity(tokenA.address, tokenB.address, amountA, amountB);
            const receipt: ContractReceipt = await tx.wait();

            const event = receipt.events?.find(event => event.event == "AddedLiquidity");
            const lpAddress: Address = event?.args!['lpPair'];

            console.log(`lpAddress: ${lpAddress}`);

            await expect(tx)
              .to.emit(addLiquidityContract, "AddedLiquidity")
              .withArgs(tokenA.address, tokenB.address, owner.address, lpAddress);

            });
          });
         
        it("should reverts if token transfer fails", async () => {
            const amountA = ethers.utils.parseEther("1")
            const amountB = ethers.utils.parseEther("2")
            await tokenA.approve(addLiquidityContract.address, amountA);
            await expect(addLiquidityContract.addLiquidity(tokenA.address, tokenB.address, amountA, amountB)).to.be.revertedWith("ERC20: insufficient allowance");
            });

        it("should reverts if incorrect token amounts supplied", async function () {
            const amountA = ethers.utils.parseEther("1")
            const amountB = ethers.utils.parseEther("2")
            await tokenA.approve(addLiquidityContract.address, amountA);
            await tokenB.approve(addLiquidityContract.address, amountB);
            
            await expect(addLiquidityContract.addLiquidity(tokenA.address, tokenB.address, amountB, amountB)).to.be.revertedWith("ERC20: insufficient allowance");
          });
        });
      });