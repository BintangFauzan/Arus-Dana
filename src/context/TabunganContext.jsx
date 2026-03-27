import { createContext, use, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TabunganContext = createContext();

export default function TabunganProvider({ children }) {
  // Form input
  const [formInput, setFormInput] = useState({
    nominal: "",
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
  // Trigger
  const [editInPlace, setEditInPlace] = useState({
    type: null
  });

  const submitPengeluaran = async (type) => {
    const storage_key = "@pengeluaran";
    try {
      const transaksi = {
        nominal: formInput.nominal,
        deskripsi: formInput.deskripsi,
        type: type,
      };
      const jsonValue = await AsyncStorage.getItem(storage_key)
      let currentData = jsonValue != null ? JSON.parse(jsonValue) : []
      currentData.push(transaksi)
      await AsyncStorage.setItem(storage_key, JSON.stringify(currentData));
      setFormInput({
        nominal:"",
        deskripsi:""
      })
      setRefresh(true)
      console.log("Berhasil simpan data", currentData);
    } catch (e) {
      console.error("Gagal menyimpan data: ", e);
    }
  };

  const submitDataDana = async (type) => {
    try{
      const dana = {
        dana: inputDana.dana,
        type: type
      }
      const jsonValue = await AsyncStorage.getItem('@uang')
      let currentData = jsonValue != null ? JSON.parse(jsonValue) : {}
      currentData[type] = dana
      await AsyncStorage.setItem('@uang', JSON.stringify(currentData))
      setEditInPlace({
        type: null
      })
      console.log("Berhasil simpan data dana")
    }catch(e){
      console.error("Error saving data dana",e)
    }
  }

  function editTrigger() {
    setEditInPlace({
      type: "inputTabungan"
    })
  }

  function editTriggerMakan(){
    setEditInPlace({
      type: "inputMakan"
    })
  }

  // const submitDataDana = async () => {
  //   try{
  //     const jsonValue = await AsyncStorage.getItem("@dana")
  //     let currentData = jsonValue != null ? JSON.parse(jsonValue) : []
  //     currentData.push(inputDana)
  //     await AsyncStorage.setItem("@dana", JSON.stringify(currentData))
  //     console.log("Berhasil input dana")
  //   }catch(e){
  //     console.error("Erro simpan dana", e)
  //   }
  // }

 const hapusDataPengeluaran = async () => {
   const storage_key = "@pengeluaran";
     try{
      await AsyncStorage.removeItem(storage_key)
      console.log("Berhasil hapus data", storage_key)
     }catch(e){
      console.error("Gagal hapus data", e)
     }
 }
  const getData = async () => {
    const storage_key = "@pengeluaran";
    try {
      const jsonValue = await AsyncStorage.getItem(storage_key);
      const data = jsonValue != null ? JSON.parse(jsonValue) : [];
      const jsonValueUang = await AsyncStorage.getItem('@uang')
      const dataUang = jsonValueUang != null ? JSON.parse(jsonValueUang) : []
      setDataUang(dataUang)
      setDataPengeluaran(data);
      setRefresh(false)
    } catch (e) {
      console.error("Error baca data pengeluaran: ", e);
    }
  };

  useEffect(() => {
    getData();
  }, [refresh]);

  const ctx = {
    formInput,
    setFormInput,
    submitPengeluaran,
    dataPengeluaran,
    hapusDataPengeluaran,
    submitDataDana,
    setInputDana,
    inputDana,
    dataUang,
    setDataUang,
    editTrigger,
    editInPlace,
    editTriggerMakan
  };
  return (
    <>
      <TabunganContext.Provider value={ctx}>
        {children}
      </TabunganContext.Provider>
    </>
  );
}
