async function main() {
    const sccContractFactory = await hre.ethers.getContractFactory("ERC20Basic");
    const sccContract = await sccContractFactory.deploy();
    await sccContract.deployed();

    console.log("Contract deployed to :", sccContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });