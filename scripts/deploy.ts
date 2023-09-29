import { ethers, run, network } from "hardhat";

const delay = async (time: number) => {
  return new Promise((resolve: any) => {
    setInterval(() => {
      resolve()
    }, time)
  })
}

async function main() {

  const piName = "PizzaToken";
  const piSymbol = "PiToken";

  const PizzaToken = await ethers.getContractFactory(piName);
  const pizzaToken = await PizzaToken.deploy();

  await pizzaToken.deployed();

  console.log(`${piName} contract deployed to: ${pizzaToken.address}`);
  console.log('Wait for delay...');
  await delay(15000); // 15 seconds
  console.log(`Starting verify ${piName}...`);

  try {
    await run('verify', {
      address: pizzaToken!.address,
      constructorArguments: [piName, piSymbol],
      contract: 'contracts/PizzaToken.sol:PizzaToken',
      network: 'goerli'
    });
    console.log('Verify success')
  } catch(e: any) {
    console.log(e.message)
  }


  const suName = "SushiToken";
  const suSymbol = "SuToken";

  const SushiToken = await ethers.getContractFactory(suName);
  const sushiToken = await SushiToken.deploy();

  await sushiToken.deployed();

  console.log(`${suName} contract deployed to: ${sushiToken.address}`);
  console.log('Wait for delay...');
  await delay(15000); // 15 seconds
  console.log(`Starting verify ${suName}...`);

  try {
    await run('verify', {
      address: sushiToken!.address,
      constructorArguments: [suName, suSymbol],
      contract: 'contracts/SushiToken.sol:SushiToken',
      network: 'goerli'
    });
    console.log('Verify success')
  } catch(e: any) {
    console.log(e.message)
  }


  let liquidityContract;

  try {
  const ContractFactory = await ethers.getContractFactory("AddLiquidity");
  const signer = (await ethers.getSigners())[0];
  liquidityContract = await ContractFactory.connect(signer).deploy();
  await liquidityContract.deployed();

  console.log(`AddLiquidity Contract deployed to: ${liquidityContract.address}`);
  } catch (e: any) {
    console.log(e.message)
  }
  console.log('Wait for delay...');
  await delay(60000);
  console.log('Starting verify AddLiquidity contract...');

  try {
    await run('verify', {
      address: liquidityContract!.address,
      contract: 'contracts/AddLiquidity.sol:AddLiquidity',
      network: 'goerli'
    });
    console.log('Verify success')
  } catch(e: any) {
    console.log(e.message)
  }

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });