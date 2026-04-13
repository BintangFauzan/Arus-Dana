import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Header from "../components/Header";
import CardTabungan from "../components/CardTabungan";
import FormInput from "../components/FormInput";
import History from "../components/History";
import { TabunganContext } from "../context/TabunganContext";

export default function App({navigation}) {
  const {
    dataPengeluaran,
    submitDataDana,
    // inputDana,
    dataUang,
    editTrigger,
    editInPlace,
    setEditInPlace,
    parseDana,
    editTriggerMakan,
    deleteLastTransaction,
    hapusData,
    sisaTabungan,
    sisaUangMakan
  } = useContext(TabunganContext);
  // console.log("input dana", inputDana);
  console.log("data uang", dataUang);
  console.log("Data pengeluaran", dataPengeluaran)

  console.log("edit in place", editInPlace);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Header />

        {/* Dashboard 2 Kolom */}
        <View style={styles.cardContainer}>
          <TouchableOpacity onPress={editTrigger}>
            <CardTabungan
              judul={"TABUNGAN"}
              saldo={sisaTabungan || 0}
              type={"Tabungan"}
              editInPlace={editInPlace}
              submitEdit={(nilaiBaru) => submitDataDana("tabungan", parseDana(nilaiBaru.dana))}
            />
          </TouchableOpacity>

          {/* Kolom Makan */}
          <TouchableOpacity style={styles.cardWrapper} onPress={editTriggerMakan}>
            <CardTabungan judul={"MAKAN"} saldo={sisaUangMakan || 0} type={"Makan"} 
            editInPlace={editInPlace}
            submitEdit={(nilaiBaru) => submitDataDana("makan",parseDana(nilaiBaru.dana))}
            />
          </TouchableOpacity>
        </View>

       <View style={styles.btnAI}>
         <TouchableOpacity onPress={() => navigation.navigate("AiScreen")}>
          <Text style={styles.btnAIText}>🤖</Text>
        </TouchableOpacity>
         <TouchableOpacity onPress={() => navigation.navigate("gado-gado")}>
          <Text style={styles.btnAIText}>Gado-gado</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    padding: 20,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  touchCardTabungan: {
    margin: 30,
  },
  touchCardMakan: {
    margin: 30,
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  historySection: {
    paddingBottom: 20,
  },
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
  historyScroll:{ maxHeight: 300},
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
  btnAI: {
  // backgroundColor: '#34A853',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 15,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  alignSelf: 'center',
  marginBottom: 15,
},
btnAIText: {
  color: 'black',
  fontWeight: 'bold',
  fontSize: 16,
  marginRight:30
},
});
