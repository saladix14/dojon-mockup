#!/data/data/com.termux/files/usr/bin/bash
# 1. Actualizar e instalar dependencias
pkg update -y && pkg upgrade -y
pkg install -y nodejs git curl nano

# 2. Instalar Expo CLI y EAS CLI
npm install -g expo-cli eas-cli

# 3. Prebuild Expo (genera android/ e ios/)
expo prebuild

# 4. Descargar Filament AAR
mkdir -p android/app/libs
curl -L -o android/app/libs/filament-release.aar \
  https://github.com/google/filament/releases/latest/download/filament-android.aar

# 5. Construir versión de desarrollo
eas build --platform android --profile development
