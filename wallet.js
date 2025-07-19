// utils/wallet.js
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";

export async function connectWallet() {
  const provider = new WalletConnectProvider({
    rpc: {
      137: "https://polygon-mainnet.infura.io/v3/61fd4076ff1a46e4bb3c902b0bb24927",
    },
    chainId: 137,
  });

  await provider.enable(); // Abre QR o conexión a Metamask Mobile
  const web3Provider = new ethers.providers.Web3Provider(provider);
  const signer = web3Provider.getSigner();
  const address = await signer.getAddress();

  return { provider, web3Provider, signer, address };
}
