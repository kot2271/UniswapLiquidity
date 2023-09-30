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

    const contractTx: ContractTransaction = await liquidityContract.addLiquidity(tokenA, tokenB, amountA, amountB, {gasLimit: 6000000});
    const contractReceipt: ContractReceipt = await contractTx.wait();
    console.log("Liquidity added!");
    const event = contractReceipt.events?.find(event => event.event === 'AddedLiquidity');
    const eInitiator: Address = event?.args!['creator'];
    const lpPair: Address = event?.args!['lpPair'];
    const lptokenA: Address = event?.args!['tokenA'];
    const lptokenB: Address = event?.args!['tokenB'];    
    const lEvent = contractReceipt.events?.find(event => event.event == "Log");
    const lValue = lEvent?.args!['val'];

    console.log(`Initiator: ${eInitiator}`);
    console.log(`Liquidity value: ${lValue}`);
    console.log(`liquidity Pair Address: ${lpPair}`);
    console.log(
      `Added liquidity for ERC20: ${lptokenA} amount: ${amountA} token(s) and ERC20: ${lptokenB} amount: ${amountB} token(s)`
      );
  });