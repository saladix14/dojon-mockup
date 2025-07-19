// utils/ethers.js
import { ethers } from "ethers";

// Tu Infura Project ID para Polygon Mainnet
const INFURA_PROJECT_ID = "61fd4076ff1a46e4bb3c902b0bb24927";
const INFURA_URL = `https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;

// Proveedor JSON‑RPC
export const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

// Función opcional para obtener un signer (si conectas wallet)
export function getSigner(provider) {
  return provider.getSigner();
}
