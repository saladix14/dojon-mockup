#!/usr/bin/env bash
set -e

echo "1️⃣  PREPARAR .env de Hardhat"
cat > .env << 'ENV'
PRIVATE_KEY=TU_CLAVE_PRIVADA_MATIC
MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
USDT_ADDRESS=0x7ef95a0Fee0c85b5bbA21459cE7dB100A36E2E01
BASE_URI=https://gateway.pinata.cloud/ipfs/
ENV

echo "2️⃣  INSTALAR Hardhat y contratos"
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers @openzeppelin/contracts dotenv

echo "3️⃣  CONFIGURAR hardhat.config.js"
cat > hardhat.config.js << 'CONFIG'
require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

module.exports = {
  solidity: '0.8.0',
  networks: {
    mumbai: {
      url: process.env.MUMBAI_RPC,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
CONFIG

echo "4️⃣  CREAR scripts/deploy.js"
mkdir -p scripts
cat > scripts/deploy.js << 'DEPLOY'
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
DEPLOY

echo "5️⃣  COMPILAR Y DESPLEGAR a Mumbai"
npx hardhat compile
npx hardhat run scripts/deploy.js --network mumbai > .deploy.out

# Extraer direcciones
NFT_ADDR=$(grep 'DojonNFTs @' .deploy.out | awk '{print \$2}')
MKT_ADDR=$(grep 'DojonMarketplace @' .deploy.out | awk '{print \$2}')

echo "→ NFT contract:   \$NFT_ADDR"
echo "→ Marketplace:    \$MKT_ADDR"

echo "6️⃣  ACTUALIZAR backend/index.js con direcciones"
BACKEND=backend/index.js
cp \$BACKEND \$BACKEND.bak
cat > \$BACKEND << 'BACKEND'
require('dotenv').config();
const express = require('express'), cors = require('cors'), { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_RPC);
const nftAbi = require('./abis/DojonNFTs.json');
const mktAbi = require('./abis/DojonMarketplace.json');
const nft = new ethers.Contract(process.env.NFT_ADDRESS || '${NFT_ADDR}', nftAbi, provider);
const mkt = new ethers.Contract(process.env.MARKET_ADDRESS || '${MKT_ADDR}', mktAbi, provider);

const app = express().use(cors());
app.get('/marketplace/listings', async (_, res) => {
  const listings = [];
  const max = Number(await nft.nextId());
  for (let id = 1; id < max; id++) {
    const lst = await mkt.listings(process.env.NFT_ADDRESS || '${NFT_ADDR}', id);
    if (lst.seller !== ethers.constants.AddressZero) {
      listings.push({
        tokenId: id,
        amount: lst.amount.toNumber(),
        price: lst.price.toString(),
        seller: lst.seller
      });
    }
  }
  res.json(listings);
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
BACKEND

echo "✅ DESPLIEGUE COMPLETADO"
echo "→ Contratos en Mumbai"
echo "   NFT  : \$NFT_ADDR"
echo "   Mkt  : \$MKT_ADDR"
echo
echo "SIGUE ESTOS PASOS:"
echo "1) Copia los ABIs compilados a backend/abis/:"
echo "     cp artifacts/contracts/DojonNFTs.sol/DojonNFTs.json backend/abis/"
echo "     cp artifacts/contracts/DojonMarketplace.sol/DojonMarketplace.json backend/abis/"
echo "2) Ajusta tu .env (o hardhat.env) para incluir:"
echo "     NFT_ADDRESS=\$NFT_ADDR"
echo "     MARKET_ADDRESS=\$MKT_ADDR"
echo "3) Levanta backend real:"
echo "     cd backend && npm install && node index.js"
echo "4) Ajusta tu frontend src/screens/MarketplaceScreen.js:"
echo "     const NFT_ADDRESS = '\$NFT_ADDR';"
echo "     const MARKET_ADDRESS = '\$MKT_ADDR';"
echo "     const BACKEND = 'http://<TU_IP>:3000';"
echo "5) Inicia tu app:"
echo "     cd ~/dojon-mockup && npx expo start --tunnel"
