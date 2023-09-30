# UniswapV2 Example

## Installation
Clone the repository using the following command:
Install the dependencies using the following command:
```shell
npm i
```

## Deployment

Fill in all the required environment variables(copy .env-example to .env and fill it). 

Deploy contract to the chain (goerli testnet):
```shell
npx hardhat run scripts/deploy.ts --network goerli
```

## Tasks

Create a new task(s) and save it(them) in the folder "tasks". Add a new task_name in the file "tasks/index.ts"

Running a approve task:
```shell
npx hardhat approve --contract {LIQUIDITY_CONTRACT_ADDRESS} --token-a {TOKEN_A_ADDRESS} --amount-a {TOKEN_A_AMOUNT} --token-b {TOKEN_B_ADDRESS} --amount-b {TOKEN_B_AMOUNT} --network goerli
```

Running a addLiquidity task:
```shell
npx hardhat addLiquidity --contract {LIQUIDITY_CONTRACT_ADDRESS} --token-a {TOKEN_A_ADDRESS} --token-b {TOKEN_B_ADDRESS} --amount-a 30000000000000000 --amount-b 50000000000000000 --network goerli
```

## Verify

Verify the installation by running the following command:
```shell
npx hardhat verify --network goerli {TOKEN_A_ADDRESS} "PizzaToken" "PiToken"
```

```shell
npx hardhat verify --network goerli {TOKEN_B_ADDRESS} "SushiToken" "SuToken"
```

```shell
npx hardhat verify --network goerli {LIQUIDITY_CONTRACT_ADDRESS}
```


{LIQUIDITY_CONTRACT_ADDRESS}: 0x23Fd7aC0AEe198Fe7AdE0B94710ED99193C5e251
{TOKEN_A_ADDRESS}: 0x3d6958bf3D102Ce785a43d0d657A6686273CAE4e
{TOKEN_B_ADDRESS}: 0x7c9B65babd46eB84825D69C92a3811Da88a48d09
{TOKEN_A_AMOUNT}: 3000000000000000000
{TOKEN_B_AMOUNT}: 5000000000000000000

liquidity Pair Address: 0x8b09873007CbE4D342DC66D00580c42ad32e522b
