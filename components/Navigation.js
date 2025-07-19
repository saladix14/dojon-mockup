import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Splash from './Splash';
import Radar from './Radar';
import Gallery from './Gallery';
import Arena from './Arena';
import Marketplace from './Marketplace';
import Courses from './Courses';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Radar') {
            iconName = focused ? 'radio' : 'radio-outline';
          } else if (route.name === 'NFTs') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Arena') {
            iconName = focused ? 'flash' : 'flash-outline';
          } else if (route.name === 'Marketplace') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Cursos') {
            iconName = focused ? 'book' : 'book-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#42f44b',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Radar" component={Radar} />
      <Tab.Screen name="NFTs" component={Gallery} />
      <Tab.Screen name="Arena" component={Arena} />
      <Tab.Screen name="Marketplace" component={Marketplace} />
      <Tab.Screen name="Cursos" component={Courses} />
    </Tab.Navigator>
  );
}
