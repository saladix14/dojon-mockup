import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { courses } from '../mockData';

export default function Courses() {
  const [data] = useState(courses);

  const renderItem = ({ item }) => (
    <View style={styles.courseItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>Nivel: {item.level}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${item.progress * 100}%` }]} />
      </View>
      <Text>Recompensa: {item.reward}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cursos Gamificados</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
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
    marginBottom: 10,
    color: '#fff',
  },
  courseItem: {
    backgroundColor: '#272727',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#555',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progress: {
    height: 10,
    backgroundColor: '#4caf50',
  },
});
