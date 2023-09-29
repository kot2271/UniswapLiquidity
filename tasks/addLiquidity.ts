import { task } from "hardhat/config";
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';


task("addLiquidity", "Adds liquidity to Uniswap V2")
  .addParam("contract", "Liquidity contract address")
  .addParam("tokenA", "Address of token A")
  .addParam("tokenB", "Address of token B")
  .addParam("amountA", "Amount of token A to deposit")
  .addParam("amountB", "Amount of token B to deposit")
  .setAction(async ({contract, tokenA, tokenB, amountA, amountB}, { ethers }) => {
    const Contract = await ethers.getContractFactory("AddLiquidity");
    const liquidityContract = Contract.attach(contract);

    const contractTx: ContractTransaction = await liquidityContract.addLiquidity(tokenA, tokenB, amountA, amountB);
    const contractReceipt: ContractReceipt = await contractTx.wait();
    console.log("Liquidity added!");
    const event = contractReceipt.events?.find(event => event.event === 'Mint');
    const eInitiator: Address = event?.args!['sender'];
    const amount0: BigNumber = event?.args!['amount0'];
    const amount1: BigNumber = event?.args!['amount1'];            

    console.log(`Initiator: ${eInitiator}`);
    console.log(`Added liquidity for ${amount0} ${tokenA} to ${amount1} ${tokenB}`)
  });