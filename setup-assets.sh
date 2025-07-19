#!/bin/bash

# Crear carpetas si no existen
mkdir -p ~/dojon-mockup/assets/background
mkdir -p ~/dojon-mockup/assets/buttons
mkdir -p ~/dojon-mockup/assets/effects

# Copiar imágenes de fondo
cp /sdcard/Download/dojo_interior.png ~/dojon-mockup/assets/background/
cp /sdcard/Download/mountains.png ~/dojon-mockup/assets/background/

# Copiar botones
cp /sdcard/Download/button_buy.png ~/dojon-mockup/assets/buttons/
cp /sdcard/Download/button_sell.png ~/dojon-mockup/assets/buttons/

# Copiar efectos
cp /sdcard/Download/smoke_effect.png ~/dojon-mockup/assets/effects/
cp /sdcard/Download/slash_trail.png ~/dojon-mockup/assets/effects/
cp /sdcard/Download/effects.png ~/dojon-mockup/assets/effects/
