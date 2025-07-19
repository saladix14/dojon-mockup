// navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/Dashboard';
import NFTs from '../screens/NFTs';
import Send from '../screens/Send';
import Scan from '../screens/Scan';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Dashboard">
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="NFTs" 
        component={NFTs} 
        options={{
          title: 'Mis NFTs',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-images" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Send" 
        component={Send} 
        options={{
          title: 'Enviar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-send" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Scan" 
        component={Scan} 
        options={{
          title: 'Escanear',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-qr-code" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
