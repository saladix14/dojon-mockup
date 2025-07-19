// screens/Scan.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function Scan() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    (async () => {
      // Pedir permiso de cámara
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScannedData(data);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sin permiso para usar la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escanear Código QR</Text>
      <BarCodeScanner
        onBarCodeScanned={scannedData ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scannedData && (
        <View style={styles.result}>
          <Text>Datos escaneados: {scannedData}</Text>
          <Button title="Escanear otra vez" onPress={() => setScannedData(null)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, margin: 16 },
  result: { position: 'absolute', bottom: 0, backgroundColor: '#fff', padding: 16 },
});
