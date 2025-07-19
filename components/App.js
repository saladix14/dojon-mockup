import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Web3Provider from './Web3Provider';
import Navigation from './components/Navigation';

export default function App() {
  return (
    <Web3Provider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </Web3Provider>
  );
}
