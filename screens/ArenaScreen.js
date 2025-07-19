// screens/ArenaScreen.js

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  Image,
  Button,
  TouchableOpacity,
  Platform,
  Dimensions
} from 'react-native';
import { WebView } from 'react-native-webview';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';

import {
  PLAYER_AVATAR,
  ENEMY_AVATAR,
  katanaJson,
  smokeJson
} from '../config';
import sounds from '../utils/sounds';

const { width, height } = Dimensions.get('window');

export default function ArenaScreen() {
  // ─── Estados y refs ────────────────────────────────────────
  const [playerHp,    setPlayerHp]    = useState(100);
  const [enemyHp,     setEnemyHp]     = useState(100);
  const [turn,        setTurn]        = useState('player');
  const [playerEnergy,setPlayerEnergy]= useState(3);
  const [skillCd,     setSkillCd]     = useState(0);
  const [log,         setLog]         = useState([]);

  const katanaAnim = useRef(null);
  const smokeAnim  = useRef(null);

  // ─── Helpers ────────────────────────────────────────────────
  const addLog = msg => setLog(l => [msg, ...l].slice(0,5));
  const endTurn = () => setTurn(t => t === 'player' ? 'enemy' : 'player');

  // ─── Turno enemigo ─────────────────────────────────────────
  useEffect(() => {
    if (turn === 'enemy' && enemyHp > 0) {
      setTimeout(enemyAction, 1000);
    }
  }, [turn]);

  async function enemyAction() {
    const choice = Math.random();
    if (choice < 0.7) {
      await playAnim('slash');
      const dmg = Math.floor(Math.random()*15)+10;
      setPlayerHp(hp => Math.max(0, hp-dmg));
      addLog(`⚔️ Enemigo ataca y hace ${dmg} dmg`);
    } else {
      addLog(`☣️ Enemigo lanza veneno (5 dmg)`);
      setPlayerHp(hp => Math.max(0, hp-5));
    }
    setPlayerEnergy(3);
    setSkillCd(cd => Math.max(0, cd-1));
    setTurn('player');
  }

  // ─── Animaciones y sonidos ─────────────────────────────────
  async function playAnim(type) {
    if (type === 'slash') {
      katanaAnim.current?.reset(); smokeAnim.current?.reset();
      katanaAnim.current?.play(); smokeAnim.current?.play();
      await (sounds.slash?.replayAsync?.() || Promise.resolve());
    }
    if (type === 'skill') {
      katanaAnim.current?.reset();
      katanaAnim.current?.play();
      await (sounds.skill?.replayAsync?.() || Promise.resolve());
    }
    if (type === 'defend') {
      await (sounds.defend?.replayAsync?.() || Promise.resolve());
    }
  }

  // ─── Acciones jugador ──────────────────────────────────────
  const handleAttack = async () => {
    if (turn !== 'player') return;
    await playAnim('slash');
    const dmg = Math.floor(Math.random()*20)+15;
    setEnemyHp(hp => Math.max(0, hp-dmg));
    addLog(`❌ Atacas y haces ${dmg} dmg`);
    endTurn();
  };

  const handleDefend = async () => {
    if (turn !== 'player') return;
    await playAnim('defend');
    addLog(`🛡️ Defiendes, daño enemigo reducido`);
    // Enemigo hará la mitad de daño en su próximo ataque
    const original = enemyAction;
    enemyAction = async () => {
      await playAnim('slash');
      const raw = Math.floor(Math.random()*15)+10;
      const reduced = Math.floor(raw/2);
      setPlayerHp(hp => Math.max(0, hp-reduced));
      addLog(`⚔️ Enemigo ataca y hace ${reduced} dmg (reducido)`);
      setTurn('player');
      setPlayerEnergy(3);
      setSkillCd(cd => Math.max(0, cd-1));
      enemyAction = original;
    };
    endTurn();
  };

  const handleSkill = async () => {
    if (turn !== 'player' || playerEnergy < 2 || skillCd > 0) return;
    await playAnim('skill');
    const dmg = Math.floor(Math.random()*50)+30;
    setEnemyHp(hp => Math.max(0, hp-dmg));
    addLog(`🌟 Skill causa ${dmg} dmg`);
    setPlayerEnergy(e => e - 2);
    setSkillCd(3);
    endTurn();
  };

  // ─── Chequeo victoria/derrota ───────────────────────────────
  useEffect(() => {
    if (enemyHp <= 0) Alert.alert('¡Victoria!','Derrotaste al enemigo');
    if (playerHp <= 0) Alert.alert('Derrota','Has sido derrotado');
  }, [playerHp, enemyHp]);

  // ─── WebView fondo + plataforma ────────────────────────────
  const webUri = Platform.select({
    android: 'file:///data/data/com.termux/files/home/dojon-mockup/assets/web/index.html',
    ios: require('../assets/web/index.html')
  });

  return (
    <View style={styles.container}>
      {/* Parallax + Plataforma dentro de un WebView */}
      <WebView
        originWhitelist={['*']}
        source={Platform.OS==='android' ? { uri: webUri } : webUri}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        scalesPageToFit
      />

      {/* Efectos Lottie superpuestos */}
      <View style={styles.fxContainer}>
        <LottieView ref={katanaAnim} source={katanaJson} style={styles.lottie} loop={false}/>
        <LottieView ref={smokeAnim}  source={smokeJson}  style={styles.lottie} loop={false}/>
      </View>

      {/* Zona de combate nativa */}
      <View style={styles.fightContainer}>
        <Image source={PLAYER_AVATAR} style={styles.avatar}/>
        <View style={styles.actions}>
          <Button title="Atacar"   onPress={handleAttack}   disabled={turn!=='player'}/>
          <Button title="Defender" onPress={handleDefend}   disabled={turn!=='player'}/>
          <Button title={`Skill (${playerEnergy})`} onPress={handleSkill}
                  disabled={turn!=='player' || playerEnergy<2 || skillCd>0}/>
        </View>
        <Image source={ENEMY_AVATAR} style={styles.avatar}/>
      </View>

      {/* Barras y log */}
      <View style={styles.barsContainer}>
        <Bar label="Tú"      value={playerHp}    max={100}/>
        <Bar label="Enemigo" value={enemyHp}     max={100}/>
        <Bar label="Energía" value={playerEnergy} max={3}/>
        <Text style={styles.cooldown}>
          Skill CD: {skillCd>0 ? `${skillCd} turnos` : 'Listo'}
        </Text>
      </View>
      <View style={styles.logContainer}>
        {log.map((msg,i)=><Text key={i} style={styles.logText}>{msg}</Text>)}
      </View>
    </View>
  );
}

// ─── Componente barra de estado ─────────────────────────────
function Bar({ label, value, max }) {
  const pct = (value/max)*100 + '%';
  return (
    <View style={{ marginBottom:4 }}>
      <Text style={styles.barLabel}>{label}: {value}/{max}</Text>
      <View style={[styles.barFill, { width: pct }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex:1, backgroundColor:'#000' },
  webview:        { position:'absolute', top:0,left:0,right:0,bottom:0, zIndex:0 },
  fxContainer:    { position:'absolute', top:0,left:0,right:0,bottom:0, zIndex:1 },
  lottie:         { width:width, height:height, position:'absolute' },
  fightContainer: { flex:1, flexDirection:'row', alignItems:'center', justifyContent:'space-around', zIndex:2 },
  avatar:         { width:80, height:80, borderRadius:8 },
  actions:        { justifyContent:'space-around', height:140 },
  barsContainer:  { position:'absolute', top:10, left:10, zIndex:2 },
  barLabel:       { color:'#fff', fontSize:12 },
  barFill:        { height:6, backgroundColor:'#1f1', borderRadius:3 },
  cooldown:       { color:'#f1a1', fontSize:12, marginTop:4 },
  logContainer:   { position:'absolute', bottom:10, left:10, zIndex:2 },
  logText:        { color:'#ccc', fontSize:10, marginVertical:1 }
});