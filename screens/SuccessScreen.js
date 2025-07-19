// screens/SuccessScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function SuccessScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>¡Pago recibido!</Text>
      <Text style={styles.subtitle}>
        Gracias por tu compra. Tu pedido está en proceso.
      </Text>
      <Button
        title="Volver al Marketplace"
        onPress={() => navigation.navigate("Products")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    color: "#0f0",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
});
