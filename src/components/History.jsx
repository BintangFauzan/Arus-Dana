import { View, Text, StyleSheet } from "react-native";

export default function History({judul, biaya, type}) {
    const dynamicStyleCard = type === 'makan' ? styles.historyAmountMakan : styles.historyAmountTabungan
  return (
    <>
      <View style={styles.historyItem}>
        <Text style={styles.historyDesc}>{judul}</Text>
        <Text style={dynamicStyleCard}>-Rp {biaya}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  historyDesc: { fontSize: 14, color: "#444" },
  historyAmountMakan: { color: "#E53935", fontWeight: "bold" },
  historyAmountTabungan: { color: "#34A853", fontWeight: "bold" },
});
