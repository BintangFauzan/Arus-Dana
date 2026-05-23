import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function History({ judul, biaya, type, onPressDeleteTransaction, tanggal, jam }) {
  const dynamicStyleCard =
    type === "makan" ? styles.historyAmountMakan : styles.historyAmountTabungan;
  const historiBiaya = Intl.NumberFormat("id-ID", {maximumSignificantDigits: 3}).format(biaya);

  let tanggalNormal
  if(tanggal.includes("/")){
    const words = tanggal.split("/")
    tanggalNormal = words.reverse().join("-")
  }else{
    tanggalNormal = tanggal
  }
  
  const dateTimeString =  tanggalNormal+"T"+jam
  const finalDateObj = new Date(dateTimeString)
  return (
    <View style={styles.historyItem}>
      <View style={styles.historyLeft}>
        <Text style={styles.historyDesc}>{judul}</Text>
        <Text style={styles.historyDateTime}>{finalDateObj.toLocaleDateString('id-ID') } • {finalDateObj.toLocaleTimeString('id-ID')}</Text>
      </View>
      <Text style={dynamicStyleCard}>-Rp {historiBiaya}</Text>
      <TouchableOpacity onPress={onPressDeleteTransaction} style={styles.deleteBtn}>
        <Text style={styles.deleteBtnText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  historyLeft: {
    flex: 1,
  },
  historyDesc: { 
    fontSize: 14, 
    color: "#444",
    marginBottom: 2,
  },
  historyDateTime: {
    fontSize: 11,
    color: "#999",
  },
  historyAmountMakan: { 
    color: "#E53935", 
    fontWeight: "bold",
    fontSize: 13,
    marginRight: 12,
  },
  historyAmountTabungan: { 
    color: "#34A853", 
    fontWeight: "bold",
    fontSize: 13,
    marginRight: 12,
  },
  deleteBtn: {
    padding: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
  },
  deleteBtnText: {
    fontSize: 14,
    color: "#999",
  }
});
