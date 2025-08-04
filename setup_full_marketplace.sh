#!/usr/bin/env bash
# setup_full_marketplace.sh
# Script “todo en uno” para configurar contratos, backend y frontend completo
# en ~/dojon-mockup, usando Hardhat, Node.js/Express y Expo/React Native.

set -e

BASE="$HOME/dojon-mockup"
echo "➡️  Asegúrate de que tu proyecto exista en: $BASE"
mkdir -p "$BASE"
cd "$BASE"

# 1) Crear contratos Solidity
echo "✏️  Generando contratos en contracts/..."
mkdir -p contracts
cat > contracts/DojonNFTs.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract DojonNFTs is ERC1155, Ownable {
    uint256 public nextId = 1;
    mapping(uint256 => string) public metadataURI;
    constructor(string memory baseURI) ERC1155(baseURI) {}
    function mint(address to, uint256 amount, string calldata uri) external onlyOwner {
        uint256 id = nextId++;
        metadataURI[id] = uri;
        _mint(to, id, amount, "");
        _setURI(uri);
    }
    function uri(uint256 id) public view override returns (string memory) {
        return metadataURI[id];
    }
}
EOF

cat > contracts/DojonMarketplace.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract DojonMarketplace is ReentrancyGuard, Ownable {
    IERC20 public usdt;
    uint256 public feePercent = 300; // 3%
    struct Listing { address seller; uint256 tokenId; uint256 amount; uint256 price; }
    mapping(address => mapping(uint256 => Listing)) public listings;
    event Listed(address seller, uint256 tokenId, uint256 amount, uint256 price);
    event Bought(address buyer, uint256 tokenId, uint256 amount, uint256 price);
    event Cancelled(address seller, uint256 tokenId);
    constructor(address _usdt) { usdt = IERC20(_usdt); }
    function list(address nftContract, uint256 tokenId, uint256 amount, uint256 price) external nonReentrant {
        IERC1155(nftContract).safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
        listings[nftContract][tokenId] = Listing(msg.sender, tokenId, amount, price);
        emit Listed(msg.sender, tokenId, amount, price);
    }
    function buy(address nftContract, uint256 tokenId) external nonReentrant {
        Listing memory lst = listings[nftContract][tokenId];
        uint256 total = lst.price * lst.amount;
        uint256 fee = (total * feePercent) / 10000;
        usdt.transferFrom(msg.sender, lst.seller, total - fee);
        usdt.transferFrom(msg.sender, owner(), fee);
        IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, lst.amount, "");
        delete listings[nftContract][tokenId];
        emit Bought(msg.sender, tokenId, lst.amount, lst.price);
    }
    function cancel(address nftContract, uint256 tokenId) external {
        Listing memory lst = listings[nftContract][tokenId];
        require(lst.seller == msg.sender, "Not seller");
        IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, lst.amount, "");
        delete listings[nftContract][tokenId];
        emit Cancelled(msg.sender, tokenId);
    }
}
EOF

# 2) Hardhat configuration and deploy script
echo "✏️  Generando hardhat.config.js y scripts/deploy.js..."
cat > hardhat.config.js << 'EOF'
require('@nomiclabs/hardhat-ethers');
require('dotenv').config();
module.exports = {
  solidity: '0.8.0',
  networks: {
    mumbai: { url: process.env.MUMBAI_RPC, accounts: [process.env.PRIVATE_KEY] },
    polygon: { url: process.env.POLYGON_RPC, accounts: [process.env.PRIVATE_KEY] }
  }
};
EOF

mkdir -p scripts
cat > scripts/deploy.js << 'EOF'
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying from', deployer.address);

  const NFTs = await ethers.getContractFactory('DojonNFTs');
  const nfts = await NFTs.deploy(process.env.BASE_URI);
  await nfts.deployed();
  console.log('DojonNFTs at', nfts.address);

  const Mkt = await ethers.getContractFactory('DojonMarketplace');
  const mkt = await Mkt.deploy(process.env.USDT_ADDRESS);
  await mkt.deployed();
  console.log('DojonMarketplace at', mkt.address);
}

main().catch(console.error);
EOF

cat > .env.example << 'EOF'
PRIVATE_KEY=tu_clave_privada
MUMBAI_RPC=https://rpc-mumbai.matic.today
POLYGON_RPC=https://polygon-rpc.com
BASE_URI=https://gateway.pinata.cloud/ipfs/
USDT_ADDRESS=0xc2132d05d31c914a87c6611c10748aeb04b58e8f
NFT_ADDRESS=0xTU_NFT_CONTRACT
MARKET_ADDRESS=0xTU_MKT_CONTRACT
EOF

# 3) Backend real
echo "✏️  Generando backend real en backend/..."
mkdir -p backend/abis
cat > backend/index.js << 'EOF'
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_RPC);
const nftAbi = require('./abis/DojonNFTs.json');
const mktAbi = require('./abis/DojonMarketplace.json');
const nft = new ethers.Contract(process.env.NFT_ADDRESS, nftAbi, provider);
const mkt = new ethers.Contract(process.env.MARKET_ADDRESS, mktAbi, provider);

const app = express().use(cors());

app.get('/marketplace/listings', async (req, res) => {
  const listings = [];
  const max = Number(await nft.nextId());
  for (let id = 1; id < max; id++) {
    const lst = await mkt.listings(process.env.NFT_ADDRESS, id);
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

app.listen(3000, () => console.log('Backend listening on http://localhost:3000'));
EOF

# 4) Frontend Expo setup
echo "✏️  Generando frontend App.js y MarketplaceScreen.js..."
cat > App.js << 'EOF'
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { WalletConnectProvider } from '@walletconnect/react-native-dapp';
import TabNavigator from './components/TabNavigator';

export default function App() {
  return (
    <WalletConnectProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </WalletConnectProvider>
  );
}
EOF

mkdir -p src/screens
cat > src/screens/MarketplaceScreen.js << 'EOF'
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { ethers } from 'ethers';
import { useWalletConnect } from '@walletconnect/react-native-dapp';

const NFT_ADDRESS = process.env.NFT_ADDRESS;
const MARKET_ADDRESS = process.env.MARKET_ADDRESS;
const BACKEND = 'http://localhost:3000';

export default function MarketplaceScreen() {
  const connector = useWalletConnect();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch(\`\${BACKEND}/marketplace/listings\`)
      .then(r => r.json())
      .then(setListings)
      .catch(console.error);
  }, []);

  const buy = async (item) => {
    if (!connector.connected) await connector.connect();
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const mkt = new ethers.Contract(
      MARKET_ADDRESS,
      ['function buy(address,uint256) external'],
      signer
    );
    try {
      const tx = await mkt.buy(NFT_ADDRESS, item.tokenId);
      await tx.wait();
      Alert.alert('Compra exitosa');
    } catch {
      Alert.alert('Error en la compra');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={i => i.tokenId.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>ID: {item.tokenId}</Text>
            <Text>Precio: {ethers.utils.formatUnits(item.price, 6)} USDT</Text>
            <Button title="Comprar" onPress={() => buy(item)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0a0a0a' },
  card: {
    backgroundColor: '#111',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: '#b59d35',
    borderWidth: 1
  }
});
EOF

# 5) Dependencies installation
echo "🔧 Instalando dependencias (puede tardar)..."
npm install --no-optional --legacy-peer-deps \
  hardhat @nomiclabs/hardhat-ethers ethers dotenv \
  express cors \
  @openzeppelin/contracts \
  @walletconnect/react-native-dapp \
  react-native-url-polyfill react-native-get-random-values \
  @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context

echo "✅ ¡Listo! Sigue estos pasos:"
echo "1) Configura backend/.env con tus valores."
echo "2) Copia los ABIs compilados tras 'npx hardhat compile' a backend/abis/."
echo "3) Despliega contratos: npx hardhat run scripts/deploy.js --network mumbai"
echo "4) Levanta backend: node backend/index.js"
echo "5) Inicia la app: npx expo start --tunnel"

chmod +x setup_full_marketplace.sh
echo "Ejecutaste con éxito setup_full_marketplace.sh"
