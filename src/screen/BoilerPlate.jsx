import React, { useState, useContext } from "react";
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from "react-native";
import Header from "../components/Header";
import CardTabungan from "../components/CardTabungan";
import FormInput from "../components/FormInput";
import History from "../components/History";
import { TabunganContext } from "../context/TabunganContext";

export default function App({ navigation }) {
  const {
    dataPengeluaran,
    submitDataDana,
    dataUang,
    editTrigger,
    editInPlace,
    setEditInPlace,
    parseDana,
    editTriggerMakan,
    deleteLastTransaction,
    hapusData,
    sisaTabungan,
    sisaUangMakan,
  } = useContext(TabunganContext);

  const [draftDanaTabungan, setDraftDanaTabungan] = useState("");
  const [draftDanaMakan, setDraftDanaMakan] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Header />

        {/* Dashboard 2 Kolom */}
        <View style={styles.cardContainer}>
          <TouchableOpacity onPress={() => { setDraftDanaTabungan(""); editTrigger(); }}>
            <CardTabungan
              judul={"TABUNGAN"}
              saldo={sisaTabungan || 0}
              type={"Tabungan"}
              editInPlace={editInPlace}
              onDanaChange={setDraftDanaTabungan}
              submitEdit={(nilaiBaru) => submitDataDana("tabungan", parseDana(nilaiBaru.dana))}
            />
            {editInPlace === "Tabungan" && (
              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.btnAction, { backgroundColor: "#34A853" }]} onPress={() => submitDataDana("tabungan", draftDanaTabungan || dataUang.tabungan?.dana || 0)}>
                  <Text style={styles.btnActionText}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnAction, { backgroundColor: "#E53935" }]} onPress={() => { setEditInPlace(null); setDraftDanaTabungan(""); }}>
                  <Text style={styles.btnActionText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>

          {/* Kolom Makan */}
          <TouchableOpacity style={styles.cardWrapper} onPress={() => { setDraftDanaMakan(""); editTriggerMakan(); }}>
            <CardTabungan
              judul={"MAKAN"}
              saldo={sisaUangMakan || 0}
              type={"Makan"}
              editInPlace={editInPlace}
              onDanaChange={setDraftDanaMakan}
              submitEdit={(nilaiBaru) => submitDataDana("makan", parseDana(nilaiBaru.dana))}
            />
            {editInPlace === "Makan" && (
              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.btnAction, { backgroundColor: "#FBBC05" }]} onPress={() => submitDataDana("makan", draftDanaMakan || dataUang.makan?.dana || 0)}>
                  <Text style={styles.btnActionText}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnAction, { backgroundColor: "#E53935" }]} onPress={() => { setEditInPlace(null); setDraftDanaMakan(""); }}>
                  <Text style={styles.btnActionText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Tombol AI + navigasi */}
        <View style={styles.btnAI}>
          <TouchableOpacity onPress={() => navigation.navigate("AiScreen")}>
            <Text style={styles.btnAIText}>🤖 AI</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <Text style={styles.btnAIText}>⚙️ Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Form Input Cepat */}
        <FormInput />

        {/* Riwayat Transaksi */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Transaksi Terakhir</Text>
          <ScrollView style={styles.historyScroll} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
            {dataPengeluaran?.map((item, index) => (
              <History
                judul={item.deskripsi}
                biaya={item.nominal}
                type={item.type}
                key={index}
                onPressDeleteTransaction={() => deleteLastTransaction(index)}
                tanggal={item.tanggal}
                jam={item.jam}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollContent: { padding: 20 },
  cardContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  cardWrapper: { flex: 1, marginHorizontal: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#333" },
  historySection: { paddingBottom: 20 },
  historyItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#EEE" },
  historyDesc: { fontSize: 14, color: "#444" },
  historyAmountMakan: { color: "#E53935", fontWeight: "bold" },
  historyAmountTabungan: { color: "#34A853", fontWeight: "bold" },
  historyScroll: { maxHeight: 300 },
  btn: { flex: 0.48, padding: 12, borderRadius: 10, alignItems: "center" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  btnTabungan: { backgroundColor: "#34A853" },
  btnMakan: { backgroundColor: "#FBBC05" },
  btnText: { color: "#FFF", fontWeight: "bold" },
  btnAI: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 15,
  },
  btnAIText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 30,
  },
  actionRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  btnAction: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  btnActionText: { color: "white", fontWeight: "bold" },
});