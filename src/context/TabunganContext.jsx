import { createContext, use, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export const TabunganContext = createContext();

export default function TabunganProvider({ children }) {
  // Form input
  const [show, setShow] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [formInput, setFormInput] = useState({
    nominal: "",
    deskripsi: "",
    type: "",
    tanggal: new Date(),
    jam: new Date()
  });
  const [inputDana, setInputDana] = useState({
    dana: 0,
    type: "",
  });
  // Data State
  const [dataPengeluaran, setDataPengeluaran] = useState([]);
  const [dataUang, setDataUang] = useState([]);
  const [refresh, setRefresh] = useState(false);
  // Id Type
  const [typeDana, setType] = useState(null);
  // Trigger
  const [editInPlace, setEditInPlace] = useState(null);

 function parseDana(text) {
  if (!text) return 0;
  let str = String(text);
  let bersih = str.replace(/\./g, "");
  return Number(bersih);
}

  function formatRibuan(text){
    const cleanNumber = text.replace(/\D/g, '')
    return cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  function handleDateAndTimeChange(event, selectedDate){
    setShow(Platform.OS === "ios")
    if(selectedDate){
      setFormInput({...formInput, tanggal: selectedDate})
    }
  }

  function handleTimeChange(event, selectedTime){
    setShowTime(Platform.OS === "ios")
    if(selectedTime){
      setFormInput({...formInput, jam: selectedTime})
    }
  }

  const submitPengeluaran = async (type) => {
    const storage_key = "@pengeluaran";
    try {
      if(parseDana(formInput.nominal) === 0 || formInput.deskripsi === ""){
        console.log("Harap isi semua field")
        return
      }
      
      const date = formInput.tanggal
      const Inputjam = formInput.jam

      const tanggalStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      const jamStr = `${String(Inputjam.getHours()).padStart(2, "0")}:${String(Inputjam.getMinutes()).padStart(2, "0")}:${String(Inputjam.getSeconds()).padStart(2, "0")}`

      const transaksi = {
        nominal: parseDana(formInput.nominal),
        deskripsi: formInput.deskripsi,
        type: type,
        tanggal: tanggalStr,
        jam: jamStr,
      };

      // Get current dataUang for balance check
      const jsonValueUang = await AsyncStorage.getItem("@uang");
      const currentDataUang =
        jsonValueUang != null ? JSON.parse(jsonValueUang) : {};

      // Get current dataPengeluaran for balance check
      const jsonValuePengeluaran = await AsyncStorage.getItem(storage_key);
      const currentDataPengeluaran =
        jsonValuePengeluaran != null ? JSON.parse(jsonValuePengeluaran) : [];

      if (type === "tabungan" && parseDana(formInput.nominal) > sisaTabungan) {
        console.log("uang tidak mencukupi untuk tabungan");
        setFormInput({
          nominal: "",
          deskripsi: "",
        });
        return; // Stop the function execution
      }

      if (type === "makan" && parseDana(formInput.nominal) > sisaUangMakan) {
        console.log("uang tidak mencukupi untuk makan");
        setFormInput({
          nominal: "",
          deskripsi: "",
        });
        return; // Stop the function execution
      }

      const jsonValue = await AsyncStorage.getItem(storage_key);
      let currentData = jsonValue != null ? JSON.parse(jsonValue) : [];
      currentData.push(transaksi);
      await AsyncStorage.setItem(storage_key, JSON.stringify(currentData));
      // calculateDana("tabungan")
      setFormInput({
        nominal: "",
        deskripsi: "",
        tanggal: new Date(),
        jam: new Date()
      });
      setRefresh(true);
      console.log("Berhasil simpan data", currentData);
      console.log("Type dana: ", typeDana);
    } catch (e) {
      console.error("Gagal menyimpan data: ", e);
    }
  };

  const submitDataDana = async (type, nilaiBaru) => {
    // Pastikan type adalah string dan bukan objek event
    if (typeof type !== "string") {
      console.warn("submitDataDana requires a string type");
      return;
    }

    try {
      const dana = {
        dana: parseDana(nilaiBaru || 0), // Gunakan nominal dari inputDana jika ada, atau pastikan itu angka
        type: type,
      };

      // Jika inputDana.dana yang digunakan (seperti di CardTabungan)
      if (nilaiBaru.dana !== undefined) {
        dana.dana = parseDana(nilaiBaru);
      }

      const jsonValue = await AsyncStorage.getItem("@uang");
      let currentData = jsonValue != null ? JSON.parse(jsonValue) : {};

      // Pastikan currentData adalah objek, bukan array
      if (Array.isArray(currentData)) currentData = {};

      currentData[type.toLowerCase()] = dana;

      await AsyncStorage.setItem("@uang", JSON.stringify(currentData));
      setEditInPlace(null);
      setRefresh(true); // Trigger refresh data agar UI update
      // console.log("Type tabungan: ", type)
      console.log("Berhasil simpan data dana", currentData);
    } catch (e) {
      console.error("Error saving data dana", e);
    }
  };

  function editTrigger() {
    setEditInPlace("Tabungan");
  }

  function editTriggerMakan() {
    setEditInPlace("Makan");
  }

  const hapusData = async () => {
    const storage_key = "@uang";
    try {
      await AsyncStorage.removeItem(storage_key);
      console.log("Berhasil hapus data", storage_key);
      setRefresh(true);
    } catch (e) {
      console.error("Gagal hapus data", e);
    }
  };

  async function deleteLastTransaction(taskRemove) {
    try {
      const listLastTransaction = await AsyncStorage.getItem("@pengeluaran");
      let currentLastTransaction =
        listLastTransaction != null ? JSON.parse(listLastTransaction) : [];
      const updateDataTransaction = currentLastTransaction.filter(
        (_, index) => index != taskRemove,
      );
      await AsyncStorage.setItem(
        "@pengeluaran",
        JSON.stringify(updateDataTransaction),
      );
      console.log("Berhasil hapus data transaksi");
      setRefresh(true);
    } catch (e) {
      console.log("Gagal hapus data transaksi", e);
    }
  }

  const totalPengeluaranTabungan = dataPengeluaran
    .filter((type) => type.type.toLowerCase() === "tabungan")
    .reduce((accumulator, currentData) => accumulator + currentData.nominal, 0);
  const totalPengeluaranMakan = dataPengeluaran
    .filter((type) => type.type === "makan")
    .reduce((accumulator, currentData) => accumulator + currentData.nominal, 0);

  const sisaTabungan =
    (dataUang.tabungan?.dana || 0) - totalPengeluaranTabungan;
  const sisaUangMakan = (dataUang.makan?.dana || 0) - totalPengeluaranMakan;

  const getData = async () => {
    const storage_key = "@pengeluaran";
    try {
      const jsonValue = await AsyncStorage.getItem(storage_key);
      const data = jsonValue != null ? JSON.parse(jsonValue) : [];

      const jsonValueUang = await AsyncStorage.getItem("@uang");
      // Inisialisasi sebagai objek {} agar konsisten
      const dataUangObj =
        jsonValueUang != null ? JSON.parse(jsonValueUang) : {};

      setDataUang(dataUangObj);
      setDataPengeluaran(data);
      setRefresh(false);
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
    deleteLastTransaction,
    sisaUangMakan,
    sisaTabungan,
    parseDana,
    formatRibuan,
    handleDateAndTimeChange,
    setShow,
    show,
    handleTimeChange
  };
  return (
    <>
      <TabunganContext.Provider value={ctx}>
        {children}
      </TabunganContext.Provider>
    </>
  );
}
