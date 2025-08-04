import WalletConnectProvider from "@walletconnect/react-native-dapp";
import { ethers } from "ethers";

export async function connectWallet() {
  try {
    const provider = new WalletConnectProvider({
      rpc: {
        137: `https://polygon-mainnet.infura.io/v3/61fd4076ff1a46e4bb3c902b0bb24927`
      },
      chainId: 137
    });

    await provider.enable();

    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();
    const address = await signer.getAddress();

    return { provider: ethersProvider, signer, address };
  } catch (error) {
    console.error("Wallet connection failed:", error);
    return null;
  }
}
