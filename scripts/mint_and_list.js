const { ethers } = require('hardhat');
require('dotenv').config();

async function main() {
  // Configuración
  const provider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Contratos
  const nftAbi = require('../artifacts/contracts/DojonNFTs.sol/DojonNFTs.json').abi;
  const mktAbi = require('../artifacts/contracts/DojonMarketplace.sol/DojonMarketplace.json').abi;
  const nft = new ethers.Contract(process.env.NFT_ADDRESS, nftAbi, wallet);
  const mkt = new ethers.Contract(process.env.MARKET_ADDRESS, mktAbi, wallet);

  // 1️⃣ Mint: acuñamos 1 unidad con metadata IPFS
  console.log('Minting token…');
  let tx = await nft.mint(wallet.address, 1, process.env.BASE_URI + 'TU_CID');
  await tx.wait();
  console.log('✅ NFT mintado. Tx hash:', tx.hash);

  // 2️⃣ Approve: permitimos al marketplace mover nuestro NFT
  console.log('Aprobando marketplace…');
  tx = await nft.setApprovalForAll(process.env.MARKET_ADDRESS, true);
  await tx.wait();
  console.log('✅ Marketplace aprobado. Tx hash:', tx.hash);

  // 3️⃣ List: lo ponemos a la venta a 10 USDT (6 decimales)
  const price = ethers.parseUnits('10', 6);
  console.log('Listando NFT a precio 10 USDT…');
  tx = await mkt.list(process.env.NFT_ADDRESS, 1, 1, price);
  await tx.wait();
  console.log('✅ NFT listado. Tx hash:', tx.hash);

  console.log('\\n🎉 ¡Listo! Tu NFT está listado on-chain en Mumbai.');
  console.log(' -> Consulta listados en tu backend: GET /marketplace/listings');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
