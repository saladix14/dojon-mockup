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
