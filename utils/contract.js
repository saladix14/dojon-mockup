// utils/contract.js

import { ethers } from 'ethers';
import { provider, getSigner } from './ethers';

// -----------------------------
// Configuración de tu token
// -----------------------------
const CONTRACT_ADDRESS = '0xTU_CONTRATO_AQUI'; // <— Pon aquí tu dirección de contrato
const ERC20_ABI = [
  // Sólo los fragmentos de ABI que usarás:
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];

// -----------------------------
// Instancia de contrato
// -----------------------------
// Si readOnly=true usa el proveedor sin firma
function getErc20Contract(readOnly = true) {
  const signerOrProvider = readOnly ? provider : getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ERC20_ABI, signerOrProvider);
}

// -----------------------------
// Lectura de balance de token
// -----------------------------
// Para una wallet cualquiera:
//    readTokenBalance('0x...')
// Para la wallet conectada (tu app):
export async function readTokenBalance(address) {
  const contract = getErc20Contract(true);
  const raw = await contract.balanceOf(address);
  // Obtén decimales automáticos:
  const decimals = await contract.decimals();
  return ethers.utils.formatUnits(raw, decimals);
}

// Para la wallet conectada (address = primer account del provider):
export async function getConnectedWalletTokenBalance() {
  // provider.listAccounts ya viene de ethers.js
  const [addr] = await provider.listAccounts();
  return readTokenBalance(addr);
}

// -----------------------------
// Envío de tokens
// -----------------------------
/**
 * Envía tokens ERC‑20 desde la wallet conectada a `to`
 * @param {string} to      Dirección destino
 * @param {string} amount  Cantidad en tokens (e.g. "10.5")
 * @returns {string}       El hash de la transacción
 */
export async function sendToken(to, amount) {
  const contract = getErc20Contract(false);
  const decimals = await contract.decimals();
  const amt = ethers.utils.parseUnits(amount, decimals);
  const tx = await contract.transfer(to, amt);
  await tx.wait();
  return tx.hash;
}

