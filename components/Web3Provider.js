import React, { createContext, useState, useEffect } from 'react';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';

export const Web3Context = createContext(null);

export default function Web3Provider({ children }) {
  const connector = useWalletConnect();
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);

  const connectWallet = async () => {
    try {
      if (!connector.connected) {
        await connector.connect();
      }
      const provider = new WalletConnectProvider({
        rpc: {
          1: 'https://mainnet.infura.io/v3/YOUR_INFURA_ID', // Ethereum Mainnet
          56: 'https://bsc-dataseed.binance.org/',          // BSC
          137: 'https://polygon-rpc.com/',                 // Polygon
        },
        chainId: 1,
        connector: connector,
        qrcode: false,
      });
      await provider.enable();
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const signer = ethersProvider.getSigner();
      setSigner(signer);
      const addr = await signer.getAddress();
      setAddress(addr);
    } catch (error) {
      console.error('Error al conectar la wallet:', error);
    }
  };

  const disconnectWallet = async () => {
    if (connector.connected) {
      connector.killSession();
      setSigner(null);
      setAddress(null);
    }
  };

  // Opcional: conectar automáticamente al montar
  useEffect(() => {
    if (!connector.connected) {
      connectWallet();
    }
  }, []);

  return (
    <Web3Context.Provider value={{ signer, address, connectWallet, disconnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
}
