import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import SuccessScreen from '../screens/SuccessScreen';
import TokensScreen from '../screens/TokensScreen';
import NFTsScreen from '../screens/NFTsScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Checkout" component={CheckoutScreen} />
      <Tab.Screen name="Success" component={SuccessScreen} />
      <Tab.Screen name="Tokens" component={TokensScreen} />
      <Tab.Screen name="NFTs" component={NFTsScreen} />
    </Tab.Navigator>
  );
}
