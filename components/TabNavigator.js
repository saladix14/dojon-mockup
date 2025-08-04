import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MarketplaceScreen from '../src/screens/MarketplaceScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0a0a0a' },
        tabBarActiveTintColor: '#ff1a1a',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ focused, color, size }) => {
          const name = focused ? 'cart' : 'cart-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} options={{ title: 'Market' }} />
    </Tab.Navigator>
  );
}
