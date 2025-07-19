import React, { useState } from 'react';
import { View, Text, Image, Button, FlatList, StyleSheet } from 'react-native';
import { nfts } from '../mockData';

export default function Gallery() {
  const [filter, setFilter] = useState('All');
  const data = filter === 'All' ? nfts : nfts.filter(item => item.category === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Galería de NFTs</Text>
      <View style={styles.filterButtons}>
        <Button title="All" onPress={() => setFilter('All')} />
        <Button title="Rare" onPress={() => setFilter('Rare')} />
        <Button title="Epic" onPress={() => setFilter('Epic')} />
      </View>
      <FlatList
        data={data}
        horizontal
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text>Poder: {item.power}</Text>
            <Text>Defensa: {item.defense}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  list: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#272727',
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 5,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
  },
});
