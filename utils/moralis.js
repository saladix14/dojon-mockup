// utils/moralis.js
import axios from 'axios';

// Tu API Key de Moralis
const MORALIS_API_KEY = 'eyJhbGci…__O3Tg';

// Base URL de Moralis para Polygon Mainnet
const MORALIS_BASE = 'https://deep-index.moralis.io/api/v2';

export async function fetchNFTs(address) {
  const url = `${MORALIS_BASE}/${address}/nft`;
  const { data } = await axios.get(url, {
    params: { chain: 'polygon', format: 'decimal', normalizeMetadata: true },
    headers: { 'X-API-Key': MORALIS_API_KEY }
  });
  return data.result; // Array de NFTs con metadata completa
}
