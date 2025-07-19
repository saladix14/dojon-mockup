// utils/wallet.js
import { Platform } from 'react-native';
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';

/**
 * Inicializa el conector de WalletConnect
 * - redirectUrl: URI de tu app (cambia "dojon://" por el esquema de tu app si lo tienes configurado)
 * - storageOptions: para Expo (usa AsyncStorage)
 */
const connector = new WalletConnectProvider({
  redirectUrl:
    Platform.OS === "web"
      ? window.location.origin
      : "dojon://", 
  storageOptions: {
    asyncStorage: AsyncStorage,
  },
  qrcodeModalOptions: {
    mobileLinks: ["metamask", "rainbow", "trust"],
  },
});

/**
 * Conecta la wallet y devuelve { address, provider, signer, connector }
 */
export async function connectWallet() {
  // Si ya está conectado, no abrir QR otra vez
  if (!connector.connected) {
    await connector.connect();
  }
  // Crea un provider de ethers.js a partir del conector
  const provider = new ethers.providers.Web3Provider(connector);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  return { address, provider, signer, connector };
}

/**
 * Desconecta la wallet
 */
export async function disconnectWallet() {
  if (connector.connected) {
    await connector.killSession();
  }
}

