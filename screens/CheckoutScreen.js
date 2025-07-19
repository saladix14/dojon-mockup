// screens/CheckoutScreen.js
import React from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { PRODUCTS } from "../data/products";
import { RECEIVER_WALLET } from "../config";
import { sendToken } from "../utils/contract"; // si quieres disparar la tx

export default function CheckoutScreen({ route, navigation }) {
  const { productId } = route.params;
  const product = PRODUCTS.find(p => p.id === productId);

  const handlePay = async () => {
    // 1) envía la tx (opcional)
    // await sendToken(RECEIVER_WALLET, product.price);
    // 2) navega a success
    navigation.replace("Success");
  };

  return (
    <View style={styles.container}>
      <Image source={product.image} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.desc}>{product.description}</Text>
      <Text style={styles.price}>{product.price} MATIC</Text>

      <Text style={styles.label}>Paga a:</Text>
      <Text selectable style={styles.address}>
        {RECEIVER_WALLET}
      </Text>

      <View style={{ marginVertical: 20 }}>
        <QRCode
          value={`ethereum:${RECEIVER_WALLET}?value=${product.price}`}
          size={160}
        />
      </View>

      <Button title="Confirmar pago" onPress={handlePay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  name: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  desc: { color: "#ccc", fontSize: 16, textAlign: "center", marginBottom: 8 },
  price: { color: "#0f0", fontSize: 20, marginBottom: 16 },
  label: { color: "#fff", marginTop: 12 },
  address: {
    color: "#0f0",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
  },
});

