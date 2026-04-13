import {
  View,
  Button,
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";

export default function Gado_gadoScreen({}) {
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedTime) => {
    // Sembunyikan picker setelah memilih (untuk Android)
    setShow(Platform.OS === "ios");

    if (selectedTime) {
      setTime(selectedTime);
    }
  };
  return (
    <>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="Pilih Jam" onPress={() => setShow(true)} />

        <Text style={{ marginTop: 20 }}>
          Jam Terpilih:{" "}
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>

        {show && (
          <DateTimePicker
            value={time}
            mode="time" // Kuncinya di sini: ubah ke "time"
            is24Hour={true} // Format 24 jam (Android saja)
            display="spinner" // Opsi: "default", "spinner", atau "clock" (Android)
            onChange={onChange}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    flexDirection: "row", // Membuat isi berderet ke samping
    alignItems: "center", // Menyejajarkan teks dan tombol secara vertikal
    justifyContent: "space-between", // Memisahkan teks ke kiri dan tombol ke ujung kanan
    backgroundColor: "#eee", // Opsional: latar belakang baris
    padding: 10,
    borderRadius: 10,
  },
  textDate: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonSquare: {
    width: 45,
    height: 45,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
});
