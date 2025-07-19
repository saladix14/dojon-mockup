// ./screens/ProductsScreen.js

import React, { useState } from 'react';
import { View, Button, StyleSheet, Image } from 'react-native';
import SlashAnimation from '../SlashAnimation'; // Ajusta la ruta si lo tienes en otra carpeta

export default function ProductsScreen() {
  const [attack, setAttack] = useState(false);

  const handleAttack = () => {
    setAttack(true);
    setTimeout(() => setAttack(false), 600); // duración de la animación
  };

  return (
    <View style={styles.container}>
      {/* Carta enemigo con animación sobrepuesta */}
      <View style={styles.cardWrapper}>
        <Image
          source={require('../assets/web/images/enemy-card.png')}
          style={styles.card}
        />
        {attack && <SlashAnimation play={attack} />}
      </View>

      {/* Botón de ataque */}
      <Button title="Atacar" onPress={handleAttack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardWrapper: {
    position: 'relative',  // para superponer la animación
    width: 150,
    height: 200,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
