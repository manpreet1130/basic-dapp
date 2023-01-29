async function main() {
  const MyContract = await ethers.getContractFactory("MyContract");

  console.log("deploying MyContract...");

  const myContract = await MyContract.deploy(5);
  await myContract.deployed();

  console.log(`MyContract deployed: ${myContract.address}`);
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});