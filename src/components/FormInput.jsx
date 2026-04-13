import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { TabunganContext } from "../context/TabunganContext";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function FormInput({}) {
  const { 
    formInput, 
    setFormInput, 
    submitPengeluaran, 
    handleDateAndTimeChange, 
    handleTimeChange,
    setShow, 
    setShowTime,
    show,
    showTime
  } = useContext(TabunganContext);

  function formatRibuan(text) {
    const cleanNumber = text.replace(/\D/g, "");
    return cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
          onChangeText={(e) =>
            setFormInput({ ...formInput, nominal: formatRibuan(e) })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Keterangan (misal: Bakso)"
          value={formInput.deskripsi}
          onChangeText={(e) => setFormInput({ ...formInput, deskripsi: e })}
        />
        {/* Tanggal */}
        <View style={styles.dateInputContainer}>
          <Text style={styles.dateText}>
            📅 {formInput.tanggal.toLocaleDateString("id-ID")}
          </Text>
          <TouchableOpacity
            style={styles.dateIconButton}
            onPress={() => {
              setShow(true);
              setShowTime(false);
            }}
          >
            <Text style={{ color: "#007AFF", fontWeight: "bold" }}>Ubah</Text>
          </TouchableOpacity>
        </View>

        {show && (
          <DateTimePicker
            value={formInput.tanggal}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleDateAndTimeChange}
          />
        )}

        {/* Jam */}
        <View style={styles.dateInputContainer}>
          <Text style={styles.dateText}>
            🕒{" "}
            {formInput.jam.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <TouchableOpacity onPress={() => {
            setShowTime(true);
            setShow(false);
          }}>
            <Text style={{ color: "#007AFF", fontWeight: "bold" }}>Ubah</Text>
          </TouchableOpacity>
        </View>

        {showTime && (
          <DateTimePicker
            value={formInput.jam}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={handleTimeChange}
          />
        )}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.btn, styles.btnTabungan]}
            onPress={() => submitPengeluaran("tabungan")}
          >
            <Text style={styles.btnText}>- Tabungan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnMakan]}
            onPress={() => submitPengeluaran("makan")}
          >
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
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,         // Tinggi disamakan dengan TextInput agar seragam
    marginBottom: 10,
    backgroundColor: "#FAFAFA", // Memberi sedikit perbedaan warna agar terlihat klik-able
  },
  dateText: {
    fontSize: 14,
    color: "#333",
  },
  dateIconButton: {
    padding: 5,
  },
});
