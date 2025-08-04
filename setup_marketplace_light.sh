
cat > setup_marketplace_light.sh << 'EOF'


#!/usr/bin/env bash set -e

echo "🧹 Limpiando node_modules y lockfile..." rm -rf node_modules package-lock.json

echo "✏️  Escribiendo package.json (sin better-sqlite3)..." cat > package.json << 'JSON' { "name": "dojon-mockup", "version": "1.0.0", "private": true, "scripts": { "start": "expo start --tunnel", "backend": "node backend/index.js" }, "overrides": { "better-sqlite3": false }, "dependencies": { "ethers": "^6.0.0", "@walletconnect/react-native-dapp": "^1.7.0", "react-native-url-polyfill": "^1.3.0", "react-native-get-random-values": "^1.8.0", "@react-navigation/native": "^6.1.7", "@react-navigation/stack": "^6.3.16", "react-native-screens": "^3.20.0", "react-native-safe-area-context": "^4.5.0", "express": "^4.18.2", "cors": "^2.8.5", "dotenv": "^16.0.3" } } JSON

echo "📦 Instalando dependencias sin opcionales..." npm install --no-optional --legacy-peer-deps

echo "🖥️  Creando backend mock..." mkdir -p backend cat > backend/index.js << 'JS' require('dotenv').config(); const express = require('express'); const cors = require('cors'); const app = express(); app.use(cors()); app.use(express.json());

const listings = [ { tokenId: '1', seller: '0x1111111111111111111111111111111111111111', price: '1000000000000000000' }, { tokenId: '2', seller: '0x2222222222222222222222222222222222222222', price: '2000000000000000000' }, { tokenId: '3', seller: '0x3333333333333333333333333333333333333333', price: '3000000000000000000' } ];

app.get('/marketplace/listings', (req, res) => { res.json(listings); });

const PORT = process.env.PORT || 3000; app.listen(PORT, () => console.log(`Backend mock corriendo en http://localhost:${PORT}`)); JS

echo "📱 Creando frontend App.js, TabNavigator y MarketplaceScreen..."

App.js

cat > App.js << 'JS' import 'react-native-url-polyfill/auto'; import 'react-native-get-random-values'; import React from 'react'; import { NavigationContainer } from '@react-navigation/native'; import { WalletConnectProvider } from '@walletconnect/react-native-dapp'; import TabNavigator from './components/TabNavigator';

export default function App() { return ( <WalletConnectProvider> <NavigationContainer> <TabNavigator /> </NavigationContainer> </WalletConnectProvider> ); } JS

TabNavigator

mkdir -p components cat > components/TabNavigator.js << 'JS' import React from 'react'; import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; import MarketplaceScreen from '../src/screens/MarketplaceScreen'; import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator(); export default function TabNavigator() { return ( <Tab.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarStyle: { backgroundColor: '#0a0a0a' }, tabBarActiveTintColor: '#ff1a1a', tabBarInactiveTintColor: '#888', tabBarIcon: ({ color, size, focused }) => { let icon = 'cart-outline'; if (focused) icon = 'cart'; return <Ionicons name={icon} size={size} color={color} />; }, })} > <Tab.Screen name="Marketplace" component={MarketplaceScreen} options={{ title: 'Market' }} /> </Tab.Navigator> ); } JS

MarketplaceScreen

mkdir -p src/screens cat > src/screens/MarketplaceScreen.js << 'JS' import React, { useEffect, useState } from 'react'; import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native'; import { ethers } from 'ethers'; import { useWalletConnect } from '@walletconnect/react-native-dapp';

const BACKEND = 'http://localhost:3000'; export default function MarketplaceScreen() { const connector = useWalletConnect(); const [listings, setListings] = useState([]); useEffect(() => { fetch(`${BACKEND}/marketplace/listings`) .then(r => r.json()) .then(setListings) .catch(console.error); }, []); const buy = async (item) => { if (!connector.connected) await connector.connect(); const provider = new ethers.providers.Web3Provider(connector); const signer = provider.getSigner(); try { const tx = await signer.sendTransaction({ to: item.seller, value: ethers.BigNumber.from(item.price), }); await tx.wait(); Alert.alert('Compra exitosa', tx.hash); } catch (e) { Alert.alert('Error en compra', e.message); } }; return ( <View style={styles.container}> <Text style={styles.header}>NFTs Marketplace</Text> <FlatList data={listings} keyExtractor={i => i.tokenId} renderItem={({ item }) => ( <View style={styles.card}> <Text>ID: {item.tokenId}</Text> <Text>Precio: {ethers.utils.formatEther(item.price)} ETH</Text> <Button title="Comprar" onPress={() => buy(item)} /> </View> )} ListEmptyComponent={<Text style={{ color: '#fff' }}>No hay listados</Text>} /> </View> ); }

const styles = StyleSheet.create({ container: { flex:1, padding:16, backgroundColor:'#0a0a0a' }, header: { fontSize:18, fontWeight:'bold', marginBottom:12, color:'#ff1a1a' }, card: { backgroundColor:'#1a1a1a', padding:12, marginBottom:10, borderRadius:8, borderColor:'#b59d35', borderWidth:1 }, }); JS

chmod +x setup_marketplace_light.sh
./setup_marketplace_light.sh

cd ~/dojon-mockup
cat > setup_marketplace_light_fixed.sh <<'EOF'
#!/usr/bin/env bash
set -e

echo "🧹 Limpiando previos node_modules y lockfile..."
rm -rf node_modules package-lock.json

echo "✏️  Creando package.json con override para evitar better-sqlite3..."
cat > package.json <<'JSON'
{
  "name": "dojon-mockup",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "expo start --tunnel",
    "backend": "node backend/index.js"
  },
  "overrides": {
    "better-sqlite3": false
  },
  "dependencies": {
    "ethers": "^6.0.0",
    "@walletconnect/react-native-dapp": "^1.7.0",
    "react-native-url-polyfill": "^1.3.0",
    "react-native-get-random-values": "^1.8.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  }
}
JSON

echo "📦 Instalando dependencias JS (sin opcionales)..."
npm install --no-optional --legacy-peer-deps

echo "📱 Instalando dependencias de Expo/navegación y vectores..."
npx expo install @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @expo/vector-icons

echo "🖥️  Creando backend mock..."
mkdir -p backend
cat > backend/index.js <<'JS'
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const listings = [
  { tokenId: '1', seller: '0x1111111111111111111111111111111111111111', price: '1000000000000000000' },
  { tokenId: '2', seller: '0x2222222222222222222222222222222222222222', price: '2000000000000000000' },
  { tokenId: '3', seller: '0x3333333333333333333333333333333333333333', price: '3000000000000000000' }
];

app.get('/marketplace/listings', (req, res) => {
  res.json(listings);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Backend mock corriendo en http://localhost:\${PORT}\`);
});
JS

echo "📁 Creando frontend (App.js, TabNavigator y pantalla)..."

# App.js
cat > App.js <<'JS'
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
JS

# TabNavigator usando @expo/vector-icons
mkdir -p components
cat > components/TabNavigator.js <<'JS'
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
          let iconName = 'cart-outline';
          if (focused) iconName = 'cart';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} options={{ title: 'Market' }} />
    </Tab.Navigator>
  );
}
JS

# MarketplaceScreen
mkdir -p src/screens
cat > src/screens/MarketplaceScreen.js <<'JS'
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { ethers } from 'ethers';
import { useWalletConnect } from '@walletconnect/react-native-dapp';

const BACKEND = 'http://localhost:3000';
export default function MarketplaceScreen() {
  const connector = useWalletConnect();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch(\`\${BACKEND}/marketplace/listings\`)
      .then(r => r.json())
      .then(setListings)
      .catch(console.error);
  }, []);

  const buy = async (item) => {
    if (!connector.connected) await connector.connect();
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    try {
      const tx = await signer.sendTransaction({
        to: item.seller,
        value: ethers.BigNumber.from(item.price),
      });
      await tx.wait();
      Alert.alert('Compra exitosa', tx.hash);
    } catch (e) {
      Alert.alert('Error en compra', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>NFTs Marketplace</Text>
      <FlatList
        data={listings}
        keyExtractor={(i) => i.tokenId}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>ID: {item.tokenId}</Text>
            <Text>Precio: {ethers.utils.formatEther(item.price)} ETH</Text>
            <Button title="Comprar" onPress={() => buy(item)} />
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#fff' }}>No hay listados</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:'#0a0a0a' },
  header: { fontSize:18, fontWeight:'bold', marginBottom:12, color:'#ff1a1a' },
  card: { backgroundColor:'#1a1a1a', padding:12, marginBottom:10, borderRadius:8, borderColor:'#b59d35', borderWidth:1 },
});
JS

echo "✅ Listo. Para arrancar:"
echo " 1) Levantar backend: node backend/index.js"
echo " 2) Iniciar Expo: npx expo start --tunnel"
