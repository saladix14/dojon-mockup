import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Button } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { tokens } from '../mockData';

export default function Radar() {
  const screenWidth = Dimensions.get('window').width - 40;
  // Preparar datos para el PieChart a partir de mockData.tokens
  const chartData = tokens.map(item => ({
    name: item.name,
    population: parseFloat(item.liquidity.replace(/,/g, '')) || 0,
    color: item.color || '#'+Math.floor(Math.random()*16777215).toString(16),
    legendFontColor: '#7F7F7F',
    legendFontSize: 12
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tokens</Text>
      <PieChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: '#1e1e1e',
          backgroundGradientFrom: '#333',
          backgroundGradientTo: '#000',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      <Text style={styles.listHeader}>Lista de Tokens</Text>
      <ScrollView style={styles.table}>
        {/* Encabezados */}
        <View style={styles.row}>
          <Text style={[styles.cell, styles.headerCell]}>Nombre</Text>
          <Text style={[styles.cell, styles.headerCell]}>Red</Text>
          <Text style={[styles.cell, styles.headerCell]}>Liquidez</Text>
          <Text style={[styles.cell, styles.headerCell]}>Fecha</Text>
          <Text style={[styles.cell, styles.headerCell]}></Text>
        </View>
        {/* Filas de datos */}
        {tokens.map(token => (
          <View style={styles.row} key={token.id}>
            <Text style={styles.cell}>{token.name}</Text>
            <Text style={styles.cell}>{token.network}</Text>
            <Text style={styles.cell}>{token.liquidity}</Text>
            <Text style={styles.cell}>{token.date}</Text>
            <Button title="Ver Detalle" onPress={() => { /* acción ejemplo */ }} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listHeader: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 5,
  },
  table: {
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#444',
  },
  cell: {
    flex: 1,
    color: '#fff',
  },
  headerCell: {
    color: '#bbb',
    fontWeight: 'bold',
  },
});
