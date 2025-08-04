async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying from', deployer.address);

  const NFTs = await ethers.getContractFactory('DojonNFTs');
  const nfts = await NFTs.deploy(process.env.BASE_URI);
  await nfts.deployed();
  console.log('DojonNFTs @', nfts.address);

  const Mkt = await ethers.getContractFactory('DojonMarketplace');
  const mkt = await Mkt.deploy(process.env.USDT_ADDRESS);
  await mkt.deployed();
  console.log('DojonMarketplace @', mkt.address);
}

main().catch(e => { console.error(e); process.exit(1); });
