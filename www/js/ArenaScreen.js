// www/js/ArenaScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text, ScrollView } from 'react-native';
import FilamentView from '../components/FilamentView';
import { NFTCard, Combat } from './combat';

const samplePlayer = [
  new NFTCard(1,'Leonardo', 100, 20, 10, 15),
  new NFTCard(2,'Raphael', 110, 18, 12, 12),
  new NFTCard(3,'Donatello', 90, 22, 8, 10),
];
const sampleEnemy = [
  new NFTCard(4,'Shredder', 120, 25, 15, 10),
  new NFTCard(5,'FootSoldier', 80, 15, 8, 20),
  new NFTCard(6,'Bebop', 100, 18, 10, 8),
];

export default function ArenaScreen() {
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);

  const startBattle = () => {
    setRunning(true);
    const combat = new Combat(samplePlayer, sampleEnemy);
    const result = combat.runAll();
    setLogs(result);
  };

  return (
    <View style={styles.container}>
      {/* Vista 3D de la arena */}
      <FilamentView style={styles.arena} modelUri="assets/arena/dojo.glb" />

      {/* HUD: botones y logs */}
      <View style={styles.hud}>
        <Button title={running ? "Combate en curso" : "Iniciar Combate"} onPress={startBattle} disabled={running}/>
        <ScrollView style={styles.logBox}>
          {logs.map((l,i)=><Text key={i} style={styles.logText}>{l}</Text>)}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#000' },
  arena:    { flex:2 },     // 2/3 de pantalla
  hud:      { flex:1, padding:8, backgroundColor:'rgba(0,0,0,0.6)' },
  logBox:   { marginTop:8, backgroundColor:'#111', padding:8, borderRadius:4 },
  logText:  { color:'#0f0', fontSize:12, marginBottom:4 }
});
