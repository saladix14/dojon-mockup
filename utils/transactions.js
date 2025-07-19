import { ethers } from 'ethers';
import { getSigner } from './ethers';

/**
 * Envía MATIC desde la wallet conectada a `toAddress`
 * @param {string} toAddress   – dirección destino
 * @param {string} amountEther – cantidad en ether (p. ej. "0.1")
 */
export async function sendMatic(toAddress, amountEther) {
  const signer = getSigner();
  const tx = await signer.sendTransaction({
    to: toAddress,
    value: ethers.utils.parseEther(amountEther),
  });
  // opcional: esperar a que se mine
  await tx.wait();
  return tx.hash;
}
