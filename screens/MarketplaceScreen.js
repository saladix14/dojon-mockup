import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Button
} from "react-native";
import { PRODUCTS } from "../data/products";

export default function ProductsScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.price}>{item.price} MATIC</Text>
      <Button
        title="Comprar"
        onPress={() =>
          navigation.navigate("Checkout", {
            productId: item.id
          })
        }
      />
    </View>
  );

  return (
    <FlatList
      data={PRODUCTS}
      keyExtractor={p => p.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 10,
    backgroundColor: "#111",
  },
  card: {
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 8,
    borderRadius: 8,
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  desc: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  price: {
    color: "#0f0",
    fontSize: 18,
    marginBottom: 8,
  },
});
