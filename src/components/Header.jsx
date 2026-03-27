import { StyleSheet, View, Text } from "react-native";

export default function Header({}) {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FundFlow</Text>
        <Text style={styles.headerSubtitle}>Kelola Keuangan Anda</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
  },
});
