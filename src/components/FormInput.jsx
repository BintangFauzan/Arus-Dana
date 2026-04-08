import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { TabunganContext } from "../context/TabunganContext";

export default function FormInput({}) {
  const { formInput, setFormInput, submitPengeluaran, hapusDataPengeluaran } =
    useContext(TabunganContext);

  function formatRibuan(text){
    const cleanNumber = text.replace(/\D/g, '')
    return cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
  return (
    <>
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Tambah Pengeluaran</Text>
        <TextInput
          style={styles.input}
          placeholder="Nominal (Rp)"
          keyboardType="numeric"
          value={formInput.nominal}
          onChangeText={(e) => setFormInput({ ...formInput, nominal: formatRibuan(e) })}
        />
        <TextInput
          style={styles.input}
          placeholder="Keterangan (misal: Bakso)"
          value={formInput.deskripsi}
          onChangeText={(e) => setFormInput({ ...formInput, deskripsi: e })}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.btn, styles.btnTabungan]} onPress={() => submitPengeluaran('tabungan')}>
            <Text style={styles.btnText}>- Tabungan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnMakan]} onPress={() => submitPengeluaran('makan')}>
            <Text style={styles.btnText}>- Makan</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={[styles.btn, styles.btnMakan]} onPress={hapusDataPengeluaran}>
            <Text style={styles.btnText}>- Hapus</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inputSection: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    flex: 0.48,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnTabungan: { backgroundColor: "#34A853" },
  btnMakan: { backgroundColor: "#FBBC05" },
  btnText: { color: "#FFF", fontWeight: "bold" },
});
