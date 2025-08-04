// www/js/arenaScreen.js

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Button, 
  FlatList, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import FilamentView from '../components/FilamentView'; // tu bridge nativo

// Ejemplo de datos de NFT (podrías cargarlos de tu contrato Web3)
const initialCards = [
  { id: '1', name: 'Hanzo', hp: 100, atk: 25, def: 10, speed: 20, model: 'assets/nft_models/hanzo.glb' },
  { id: '2', name: 'Kenshi', hp: 90, atk: 30, def: 8, speed: 25, model: 'assets/nft_models/kenshi.glb' },
  { id: '3', name: 'Shinobi', hp: 80, atk: 20, def: 12, speed: 22, model: 'assets/nft_models/shinobi.glb' },
];

export default function ArenaScreen() {
  // Estado de los tres slots de cada jugador
  const [playerCards, setPlayerCards] = useState(initialCards);
  const [enemyCards, setEnemyCards] = useState(initialCards.map(c => ({ ...c, id: 'e' + c.id })));
  
  // Índice del turno: alterna entre 0 y 1 (0 = jugador, 1 = enemigo)
  const [turn, setTurn] = useState(0);
  // Log de acciones
  const [log, setLog] = useState([]);

  // Referencia al componente Filament (por si quieres enviar mensajes nativos)
  const filamentRef = useRef(null);

  // Función para calcular un turno de combate
  const handleAttack = () => {
    const attackerCards = turn === 0 ? playerCards : enemyCards;
    const defenderCards = turn === 0 ? enemyCards : playerCards;

    // Selecciona la carta con más speed
    const sortedAttackers = [...attackerCards].sort((a,b) => b.speed - a.speed);
    const sortedDefenders = [...defenderCards].sort((a,b) => b.speed - a.speed);

    const attacker = sortedAttackers[0];
    const defender = sortedDefenders[0];

    // Daño = atk - def (mínimo 1)
    const damage = Math.max(attacker.atk - defender.def, 1);

    // Aplica daño
    const updatedDefenders = defenderCards.map(c => 
      c.id === defender.id ? { ...c, hp: Math.max(c.hp - damage, 0) } : c
    );

    // Actualiza estado
    if (turn === 0) setEnemyCards(updatedDefenders);
    else setPlayerCards(updatedDefenders);

    // Añade al log
    const actor = turn === 0 ? 'Jugador' : 'Enemigo';
    setLog(prev => [
      `${actor} usa ${attacker.name} y hace ${damage} de daño a ${defender.name}`,
      ...prev
    ]);

    // Cambia turno
    setTurn(1 - turn);
  };

  // Comprueba fin de combate
  useEffect(() => {
    const playerAlive = playerCards.some(c => c.hp > 0);
    const enemyAlive = enemyCards.some(c => c.hp > 0);
    if (!playerAlive || !enemyAlive) {
      const winner = playerAlive ? '¡Ganaste!' : '¡Perdiste!';
      setLog(prev => [winner, ...prev]);
    }
  }, [playerCards, enemyCards]);

  // Renderiza cada carta NFT con barra de vida
  const renderCard = (card) => (
    <View style={styles.card}>
      <Text style={styles.cardName}>{card.name}</Text>
      <View style={styles.barBack}>
        <View style={[styles.barFront, { width: `${(card.hp/100)*100}%` }]} />
      </View>
      <Text style={styles.stat}>HP: {card.hp}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Vista 3D con Filament */}
      <View style={styles.filamentContainer}>
        <FilamentView 
          ref={filamentRef}
          style={styles.filament} 
          // podrías usar un uri dinámico para el entorno
          modelUri="assets/nft_models/arena.glb" 
        />
      </View>

      {/* Panel de combate */}
      <View style={styles.battlePanel}>
        <Text style={styles.turnText}>Turno de: {turn === 0 ? 'Jugador' : 'Enemigo'}</Text>

        <View style={styles.row}>
          <FlatList
            data={playerCards}
            keyExtractor={c => c.id}
            horizontal
            renderItem={({ item }) => renderCard(item)}
          />
        </View>
        <View style={styles.row}>
          <FlatList
            data={enemyCards}
            keyExtractor={c => c.id}
            horizontal
            renderItem={({ item }) => renderCard(item)}
          />
        </View>

        <Button 
          title="Atacar" 
          onPress={handleAttack} 
          disabled={!playerCards.some(c => c.hp>0) || !enemyCards.some(c => c.hp>0)}
        />

        <ScrollView style={styles.log}>
          {log.map((entry, i) => (
            <Text key={i} style={styles.logText}>• {entry}</Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  filamentContainer: { flex: 3 },
  filament: { flex: 1 },
  battlePanel: { flex: 2, padding: 8, backgroundColor: '#111' },
  turnText: { color: '#ff1a1a', fontSize: 18, textAlign: 'center', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'center', marginVertical: 4 },
  card: {
    width: 100, marginHorizontal: 4, padding: 4, backgroundColor: '#222', borderRadius: 6
  },
  cardName: { color: '#fff', textAlign: 'center', marginBottom: 4 },
  barBack: { height: 6, backgroundColor: '#444', borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  barFront: { height: 6, backgroundColor: '#ff1a1a' },
  stat: { color: '#ccc', textAlign: 'center' },
  log: { marginTop: 8, backgroundColor: '#000', borderRadius: 4, padding: 4, maxHeight: 100 },
  logText: { color: '#fff', fontSize: 12 }
});
