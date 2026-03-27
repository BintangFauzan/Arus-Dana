import { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { TabunganContext } from "../context/TabunganContext";

export default function CardTabungan({
  judul,
  type,
  saldo,
  editInPlace,
  onSubmitEditing,
  touchAble
}) {
  const { inputDana, setInputDana, submitDataDana } = useContext(TabunganContext);
  const dynamicStyleCard =
    type === "makan" ? styles.cardMakan : styles.cardTabungan;
  const icon = type === "makan" ? "🍴" : "💰";
  const saldoDana = Intl.NumberFormat("id-ID", {maximumSignificantDigits: 3}).format(saldo)
  return (
    <>
      <View style={[styles.card, dynamicStyleCard]}>
        <Text style={styles.cardLabel}>
          {icon} DANA {judul}
        </Text>
        {editInPlace === "inputTabungan" || editInPlace === "inputMakan" ? (
          <TextInput
            style={styles.cardAmount}
            onSubmitEditing={onSubmitEditing}
            value={inputDana}
            onChangeText={(e) => setInputDana({ ...inputDana, dana:e })}
          />
        ) : (
          <Text style={styles.cardAmount}>Rp {saldoDana}</Text>
        )}
        <Text style={styles.cardFooter}>
          {type === "makan" ? "Sisa Anggaran" : "Saldo Saat Ini"}
        </Text>
        <View style={styles.buttonRow}>
          {touchAble}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 0.48, // Memberikan sedikit jarak di tengah
    padding: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTabungan: {
    backgroundColor: "#E6F4EA",
    borderLeftWidth: 5,
    borderLeftColor: "#34A853",
  },
  cardMakan: {
    backgroundColor: "#FFF4E5",
    borderLeftWidth: 5,
    borderLeftColor: "#FBBC05",
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  cardFooter: {
    fontSize: 10,
    color: "#888",
    marginTop: 5,
  },
  btn: {
    flex: 0.48,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnTabungan: { backgroundColor: "#34A853" },
  btnMakan: { backgroundColor: "#FBBC05" },
  btnText: { color: "#FFF", fontWeight: "bold" },
});
