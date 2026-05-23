import { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TabunganContext } from "../context/TabunganContext";
import { askAI } from "../services/aiService";
import ModalPopup from "../components/ModalPopup";

export default function AiScreen({}) {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const scrollViewRef = useRef(null);

  const {
    dataUang,
    dataPengeluaran,
    sisaTabungan,
    sisaUangMakan,
    submitPengeluaran,
  } = useContext(TabunganContext);

  // Auto scroll ke bawah saat ada message baru
  useEffect(() => {
    if (scrollViewRef.current && message.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [message]);

  function buildContext() {
    const tabungan = dataUang?.tabungan?.dana ?? 0;
    const makan = dataUang?.makan?.dana ?? 0;

    const now = new Date();

    const tigaPuluhHari = 30 * 24 * 60 * 60 * 1000;
    const tigaPuluhHariLalu = now - tigaPuluhHari;
    const sebulanLalu = new Date(tigaPuluhHariLalu);

    const recentTransactions = dataPengeluaran
      .filter((t) => {
       let cleanDateString = t.tanggal.includes("/") ? t.tanggal.split("/").reverse().join("-") : t.tanggal
       const itemDate = new Date(cleanDateString + "T" + t.jam)
       return itemDate >= sebulanLalu
      })
      .map(
        (t) => {
         let cleanDateString = t.tanggal.includes("/") ? t.tanggal.split("/").reverse().join("-") : t.tanggal
         const finalItemDate = new Date(cleanDateString+"T"+t.jam)
         return `${finalItemDate.toLocaleDateString('id-ID')} ${finalItemDate.toLocaleTimeString('id-ID')}: ${t.deskripsi} (Rp ${t.nominal.toLocaleString('id-ID')}) [${t.type}]`
        }
      )
      .join("\n");

      console.log("recent transaksion", recentTransactions)

    return `
              Tanggal Hari Ini:
              ${now.toLocaleDateString("id-ID")}

              Saldo Awal:
              - Tabungan: Rp ${tabungan.toLocaleString("id-ID")}
              - Makan: Rp ${makan.toLocaleString("id-ID")}

              Sisa Saat Ini:
              - Sisa Tabungan: Rp ${(sisaTabungan || 0).toLocaleString("id-ID")}
              - Sisa Makan: Rp ${(sisaUangMakan || 0).toLocaleString("id-ID")}

              Riwayat Transaksi 30 Hari Terakhir":
              ${recentTransactions || "Belum ada transaksi."}
    `.trim();
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessage((prevState) => [
      ...prevState,
      { from: "user", text: userMessage },
    ]);
    setInput("");
    setLoading(true);

    try {
      const answer = await askAI(userMessage, buildContext());
      const regex = /###DATA_START###([\s\S]*?)###DATA_END###/;
      const match = answer.match(regex);

      if (match) {
        const extractedData = JSON.parse(match[1]);
        setPendingData(extractedData);
        const cleanMsg = answer.replace(regex, "").trim();
        setMessage((prevState) => [
          ...prevState,
          { from: "ai", text: cleanMsg },
        ]);
        setIsModalVisible(true);
      } else {
        setMessage((prevState) => [...prevState, { from: "ai", text: answer }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleConfirmAiInput = async () => {
    if (pendingData) {
      await submitPengeluaran(pendingData.type, pendingData);
      setIsModalVisible(false);
      setPendingData(null);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
        enabled={true}
      >
        <View style={styles.container}>
          {/* Modal Popup */}
          <ModalPopup
            visible={isModalVisible}
            data={pendingData}
            CloseModal={() => setIsModalVisible(false)}
            onConfirm={handleConfirmAiInput}
          />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>AI Assistant</Text>
          </View>

          {/* Chat */}
          <ScrollView
            ref={scrollViewRef}
            keyboardShouldPersistTaps="handled"
            style={styles.chatContainer}
            contentContainerStyle={{ paddingBottom: 20 }}
            scrollEventThrottle={16}
          >
            {message.length === 0 ? (
              <View style={styles.welcome}>
                <Text style={styles.welcomeEmoji}>👋</Text>
                <Text style={styles.welcomeTitle}>Halo! Saya AI Assistant</Text>
                <Text style={styles.welcomeText}>
                  Tanyakan apa saja tentang keuangan Anda:
                </Text>
                <Text style={styles.example}>• Berapa sisa tabungan saya?</Text>
                <Text style={styles.example}>
                  • Berapa total pengeluaran makan?
                </Text>
                <Text style={styles.example}>
                  • Berapa sisa uang makan saya?
                </Text>
              </View>
            ) : (
              message.map((msg, idx) => (
                <View
                  key={idx}
                  style={[
                    msg.from === "user" ? styles.userBubble : styles.aiBubble,
                  ]}
                >
                  <Text
                    style={
                      msg.from === "user" ? styles.userText : styles.aiText
                    }
                  >
                    {msg.text}
                  </Text>
                </View>
              ))
            )}
            {loading && (
              <View style={styles.loading}>
                <ActivityIndicator size="small" color="#34A853" />
                <Text style={styles.loadingText}>AI sedang mengetik...</Text>
              </View>
            )}
          </ScrollView>

          {/* input pesan */}
          <View style={styles.inputRow}>
            <TextInput
              multiline={true}
              style={styles.input}
              placeholder="Tanya AI"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={sendMessage}
              disabled={loading}
            >
              <Text style={styles.sendText}>Kirim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    backgroundColor: "#FFF",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  back: { color: "#34A853", fontSize: 16 },
  chatContainer: { flex: 1, paddingHorizontal: 20, marginTop: 10 },
  welcome: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeEmoji: { fontSize: 48, marginBottom: 10 },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
  },
  example: { fontSize: 13, color: "#34A853", marginBottom: 5 },
  userBubble: {
    backgroundColor: "#34A853",
    alignSelf: "flex-end",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: "80%",
  },
  aiBubble: {
    backgroundColor: "#E8F5E9",
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: "80%",
  },
  userText: { color: "#FFF" },
  aiText: { color: "#333" },
  loading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  loadingText: { marginLeft: 8, color: "#666" },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    minHeight: 40,
  },
  sendBtn: {
    backgroundColor: "#34A853",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 8,
  },
  sendText: { color: "#FFF", fontWeight: "bold" },
});
