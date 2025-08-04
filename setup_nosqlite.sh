#!/usr/bin/env bash
set -e

# Ruta de tu proyecto
BASE="$HOME/dojon-mockup"
echo "➡️  Asegúrate de que tu proyecto esté en: $BASE"
cd "$BASE"

# 1) Limpieza de instalaciones previas
echo "🧹 Limpiando node_modules y lockfile..."
rm -rf node_modules package-lock.json

# 2) Generar package.json con override para bloquear better-sqlite3
echo "✏️  Creando package.json con override..."
cat > package.json << 'EOF'
{
  "name": "dojon-mockup",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "expo start",
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
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "react-native-screens": "^3.20.0",
    "react-native-safe-area-context": "^4.5.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0"
  }
}
EOF

# 3) Instalar dependencias sin opcionales ni nativos
echo "📦 Instalando dependencias (sin opcionales)..."
npm install --no-optional --legacy-peer-deps

# 4) Crear backend mock sin SQLite
echo "🖥️  Configurando backend mock en backend/index.js..."
mkdir -p backend
cat > backend/index.js << 'EOF'
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Listado simulado de NFTs
let listings = [
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
EOF

echo "✅ Script completado exitosamente."
echo "Para arrancar el backend:  cd backend && node index.js"
echo "Para arrancar Expo:      cd $BASE && expo start --tunnel"
