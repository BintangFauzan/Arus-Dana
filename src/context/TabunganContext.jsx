import { createContext, use, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TabunganContext = createContext();

export default function TabunganProvider({ children }) {
  // Form input
  const [formInput, setFormInput] = useState({
    nominal: 0,
    deskripsi: "",
    type: "",
  });
  const [inputDana, setInputDana] = useState({
    dana:0,
    type:""
  })
  // Data State
  const [dataPengeluaran, setDataPengeluaran] = useState([]);
  const [dataUang, setDataUang] = useState([])
  const [refresh, setRefresh] = useState(false)
  // Id Type
  const [typeDana, setType] = useState(null)
  // Trigger
  const [editInPlace, setEditInPlace] = useState(null);

  const submitPengeluaran = async (type) => {
    const storage_key = "@pengeluaran";
    try {
      const transaksi = {
        nominal: Number(formInput.nominal),
        deskripsi: formInput.deskripsi,
        type: type,
      };
      const jsonValue = await AsyncStorage.getItem(storage_key)
      let currentData = jsonValue != null ? JSON.parse(jsonValue) : []
      currentData.push(transaksi)
      await AsyncStorage.setItem(storage_key, JSON.stringify(currentData));
      calculateDana("tabungan")
      setFormInput({
        nominal:"",
        deskripsi:""
      })
      setRefresh(true)
      console.log("Berhasil simpan data", currentData);
      console.log("Type dana: ", typeDana)
    } catch (e) {
      console.error("Gagal menyimpan data: ", e);
    }
  };

  const submitDataDana = async (type) => {
    // Pastikan type adalah string dan bukan objek event
    if (typeof type !== 'string') {
      console.warn("submitDataDana requires a string type");
      return;
    }

    try {
      const dana = {
        dana: Number(inputDana.nominal || 0), // Gunakan nominal dari inputDana jika ada, atau pastikan itu angka
        type: type
      }
      
      // Jika inputDana.dana yang digunakan (seperti di CardTabungan)
      if (inputDana.dana !== undefined) {
        dana.dana = Number(inputDana.dana);
      }

      const jsonValue = await AsyncStorage.getItem('@uang')
      let currentData = jsonValue != null ? JSON.parse(jsonValue) : {}
      
      // Pastikan currentData adalah objek, bukan array
      if (Array.isArray(currentData)) currentData = {};

      currentData[type.toLowerCase()] = dana;
      
      await AsyncStorage.setItem('@uang', JSON.stringify(currentData))
      setEditInPlace(null)
      setRefresh(true) // Trigger refresh data agar UI update
      // console.log("Type tabungan: ", type)
      console.log("Berhasil simpan data dana", currentData)
    } catch (e) {
      console.error("Error saving data dana", e)
    }
  }

  function editTrigger() {
    setEditInPlace("Tabungan")
  }

  function editTriggerMakan() {
    setEditInPlace("Makan")
  }

  const hapusData = async () => {
    const storage_key = "@uang";
    try {
      await AsyncStorage.removeItem(storage_key)
      console.log("Berhasil hapus data", storage_key)
      setRefresh(true)
    } catch (e) {
      console.error("Gagal hapus data", e)
    }
  }

  async function deleteLastTransaction(taskRemove) {
    try{
      const listLastTransaction = await AsyncStorage.getItem("@pengeluaran")
      let currentLastTransaction = listLastTransaction != null ? JSON.parse(listLastTransaction) : []
      const updateDataTransaction = currentLastTransaction.filter((_,index) => index != taskRemove)
      await AsyncStorage.setItem("@pengeluaran", JSON.stringify(updateDataTransaction))
      console.log("Berhasil hapus data transaksi")
      setRefresh(true)
    }catch(e){
      console.log("Gagal hapus data transaksi", e)
    }
  }

  // Masih dalam proses
  async function calculateDana(type) {
     if (typeof type !== 'string') {
      console.warn("calculate dana requires a string type");
      return;
    }
    try{
      const jsonUang = await AsyncStorage.getItem("@uang")
      let currentDataUang = jsonUang != null ? JSON.parse(jsonUang) : {}
      let uangSaatIni = currentDataUang?.tabungan?.dana

      const jsonTransaksiTerakhir = await AsyncStorage.getItem("@pengeluaran")
      let currentDataTransaksi = jsonTransaksiTerakhir != null ? JSON.parse(jsonTransaksiTerakhir) : []
      let transaksiSaatIni = currentDataTransaksi.map((item) => item.nominal)
      const totalTransaksi = transaksiSaatIni.reduce((accumulator, currentData) => accumulator + currentData, 0)
      // Calculate
      let calculate = 10
      if(type === "tabungan"){
        calculate = uangSaatIni - Number(formInput.nominal)
      }
      const dana = {
        dana: Number(calculate || 0), // Gunakan nominal dari inputDana jika ada, atau pastikan itu angka
        type: type
      }
       // Pastikan currentData adalah objek, bukan array
      if (Array.isArray(calculate)) calculate = {};


      currentDataUang[type.toLowerCase()] = dana
      await AsyncStorage.setItem("@uang", JSON.stringify(currentDataUang))
      console.log("Berhasil mengurangi uang")
      console.log("Hasil perhitungan", currentDataUang)
      return calculate
    }catch(e){
      console.error("Gagal hitung uang", e)
    }
  }

  const getData = async () => {
    const storage_key = "@pengeluaran";
    try {
      const jsonValue = await AsyncStorage.getItem(storage_key);
      const data = jsonValue != null ? JSON.parse(jsonValue) : [];
      
      const jsonValueUang = await AsyncStorage.getItem('@uang')
      // Inisialisasi sebagai objek {} agar konsisten
      const dataUangObj = jsonValueUang != null ? JSON.parse(jsonValueUang) : {}
      
      setDataUang(dataUangObj)
      setDataPengeluaran(data);
      setRefresh(false)
    } catch (e) {
      console.error("Error baca data pengeluaran: ", e);
    }
  };

  useEffect(() => {
    getData();
    // calculateDana()
  }, [refresh]);

  const ctx = {
    formInput,
    setFormInput,
    submitPengeluaran,
    dataPengeluaran,
    hapusData,
    submitDataDana,
    setInputDana,
    inputDana,
    dataUang,
    setDataUang,
    editTrigger,
    editInPlace,
    setEditInPlace, // Tambahkan ini
    editTriggerMakan,
    deleteLastTransaction
  };
  return (
    <>
      <TabunganContext.Provider value={ctx}>
        {children}
      </TabunganContext.Provider>
    </>
  );
}
