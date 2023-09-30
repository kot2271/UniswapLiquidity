import { task } from "hardhat/config";
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

const TOKEN_A_NAME = "PizzaToken";
const TOKEN_B_NAME = "SushiToken";

task("approve", "Approve spender")
.addParam("contract", "Liquidity contract address")
.addParam("tokenA", `${TOKEN_A_NAME} address`)
.addParam("amountA", `${TOKEN_A_NAME} allowance amount`)
.addParam("tokenB", `${TOKEN_B_NAME} address`)
.addParam("amountB", `${TOKEN_B_NAME} allowance amount`)
.setAction(async ({contract, tokenA, amountA, tokenB, amountB}, { ethers }) => {
    const TokenA = await ethers.getContractFactory(TOKEN_A_NAME);
    const tokenAContract = TokenA.attach(tokenA);

    const TokenB = await ethers.getContractFactory(TOKEN_B_NAME);
    const tokenBContract = TokenB.attach(tokenB);

    const tokenATransaction: ContractTransaction = await tokenAContract.approve(contract, amountA);
    const contractAReceipt: ContractReceipt = await tokenATransaction.wait();
    const eventA = contractAReceipt.events?.find(event => event.event === 'Approval');
    const ownerA: Address = eventA?.args!['owner'];
    const spenderA: Address = eventA?.args!['spender'];
    const amountTokenA: BigNumber = eventA?.args!['value'];
    
    const tokenBTransaction: ContractTransaction = await tokenBContract.approve(contract, amountB);
    const contractBReceipt: ContractReceipt = await tokenBTransaction.wait();
    const eventB = contractBReceipt.events?.find(event => event.event === 'Approval');
    const ownerB: Address = eventB?.args!['owner'];
    const spenderB: Address = eventB?.args!['spender'];
    const amountTokenB: BigNumber = eventB?.args!['value'];

    console.log(`${TOKEN_A_NAME} owner: ${ownerA}`);
    console.log(`${TOKEN_A_NAME} spender: ${spenderA}`);
    console.log(`${TOKEN_A_NAME} amount: ${amountTokenA}`);
    console.log(`Approved ${contract} to spend ${amountA} ${TOKEN_A_NAME}'s`);

    console.log(`${TOKEN_B_NAME} owner: ${ownerB}`);
    console.log(`${TOKEN_B_NAME} spender: ${spenderB}`);
    console.log(`${TOKEN_B_NAME} amount: ${amountTokenB}`);
    console.log(`Approved ${contract} to spend ${amountB} ${TOKEN_B_NAME}'s`);
});