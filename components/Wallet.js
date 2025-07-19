import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';
import { Web3Context } from '../Web3Provider';

export default function Wallet() {
  const { address } = useContext(Web3Context);
  const [balance, setBalance] = useState(0);

  // Simular obtención de saldo
  useEffect(() => {
    setBalance(123.45);
  }, []);

  const screenWidth = Dimensions.get('window').width - 40;
  const rewardData = {
    labels: ['Ene', 'Feb', 'Mar'], // ejemplos de meses
    data: [0.5, 0.8, 0.2]          // datos normalizados (0 a 1)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cartera NSQD</Text>
      <Text>Dirección: {address || 'No conectada'}</Text>
      <Text style={styles.balance}>Saldo: {balance} NSQD</Text>
      <Text style={styles.subheader}>Recompensas Acumuladas</Text>
      <ProgressChart
        data={rewardData}
        width={screenWidth}
        height={220}
        strokeWidth={16}
        radius={32}
        chartConfig={{
          backgroundColor: '#1e1e1e',
          backgroundGradientFrom: '#3a3a3a',
          backgroundGradientTo: '#000',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        }}
        hideLegend={false}
      />
      <Button title="Reclamar" onPress={() => { /* acción de reclamo */ }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  subheader: {
    fontSize: 18,
    marginTop: 20,
    color: '#fff',
  },
  balance: {
    fontSize: 20,
    marginVertical: 10,
    color: '#fff',
  },
});
