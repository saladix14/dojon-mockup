import React, { useState } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

export default function Arena() {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);

  const attackEnemy = () => {
    setEnemyHealth(h => Math.max(h - 10, 0));
  };
  const skillEnemy = () => {
    setEnemyHealth(h => Math.max(h - 20, 0));
  };
  const attackPlayer = () => {
    setPlayerHealth(h => Math.max(h - 10, 0));
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Combate Arena</Text>
      <View style={styles.combatContainer}>
        <View style={styles.fighter}>
          <Image source={require('../assets/images/nft_enemy.png')} style={styles.image} />
          <Text style={styles.health}>Vida: {enemyHealth}</Text>
        </View>
        <View style={styles.fighter}>
          <Image source={require('../assets/images/nft_player.png')} style={styles.image} />
          <Text style={styles.health}>Vida: {playerHealth}</Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <Button title="Atacar Enemigo" onPress={attackEnemy} />
        <Button title="Habilidad Enemigo" onPress={skillEnemy} />
        <Button title="Atacar Jugador" onPress={attackPlayer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  combatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  fighter: {
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  health: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttons: {
    marginTop: 30,
    width: '100%',
    justifyContent: 'space-evenly',
    height: 150,
  },
});
