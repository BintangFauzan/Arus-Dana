import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveAiConfig, fetchModels, loadAiConfig } from "../services/aiService";

const PROVIDERS = [
  { key: "gemini", label: "Google Gemini" },
  { key: "openrouter", label: "OpenRouter" },
  { key: "custom", label: "Custom URL" },
];

export default function SettingsScreen() {
  const [provider, setProvider] = useState("gemini");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState("");
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    loadAiConfig().then((c) => {
      setProvider(c.provider || "gemini");
      setApiKey(c.apiKey || "");
      setBaseUrl(c.baseUrl || "");
      setModel(c.model || "");
    });
  }, []);

  const handleProviderChange = (p) => {
    setProvider(p);
    setApiKey("");
    setModel("");
    setModels([]);
  };

  const handleFetchModels = async () => {
    if (!apiKey.trim()) {
      Alert.alert("API Key kosong", "Masukkan API Key terlebih dahulu.");
      return;
    }
    if (provider === "custom" && !baseUrl.trim()) {
      Alert.alert("Base URL kosong", "Masukkan base URL terlebih dahulu.");
      return;
    }
    setLoadingModels(true);
    try {
      const fetched = await fetchModels({
        provider,
        apiKey: apiKey.trim(),
        baseUrl: baseUrl.trim(),
      });
      setModels(fetched);
      if (fetched.length && !model) setModel(fetched[0]);
    } catch (e) {
      Alert.alert("Gagal mengambil model", e.message || "Tidak dapat menghubungi server.");
    } finally {
      setLoadingModels(false);
    }
  };

  const handleSave = async () => {
    const newCfg = {
      provider,
      apiKey: apiKey.trim(),
      baseUrl: provider === "custom" ? baseUrl.trim() : "",
      model: model || undefined,
    };
    await saveAiConfig(newCfg);
    Alert.alert("Tersimpan", "Konfigurasi AI berhasil disimpan.");
  };

  const handleRemove = () => {
    Alert.alert(
      "Hapus konfigurasi?",
      "Aplikasi akan kembali ke API Key bawaan (jika ada).",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          onPress: async () => {
            await AsyncStorage.removeItem("@ai_config");
            setApiKey("");
            setBaseUrl("");
            setModel("");
            setModels([]);
            Alert.alert("Dihapus", "Konfigurasi AI dihapus.");
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
    >
      <Text style={styles.headerTitle}>Settings AI</Text>
      <Text style={styles.headerSubtitle}>
        Gunakan API Key milikmu sendiri. Tidak perlu login.
      </Text>

      <Text style={styles.label}>Provider</Text>
      <View style={styles.row}>
        {PROVIDERS.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[
              styles.segment,
              provider === p.key && styles.segmentActive,
            ]}
            onPress={() => handleProviderChange(p.key)}
          >
            <Text
              style={[
                styles.segmentText,
                provider === p.key && styles.segmentTextActive,
              ]}
            >
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {provider === "custom" && (
        <>
          <Text style={styles.label}>Base URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://api.contoh.com"
            value={baseUrl}
            onChangeText={setBaseUrl}
            autoCapitalize="none"
          />
        </>
      )}

      <Text style={styles.label}>API Key</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan API Key"
        secureTextEntry
        value={apiKey}
        onChangeText={setApiKey}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity
        style={styles.fetchBtn}
        onPress={handleFetchModels}
        disabled={loadingModels}
      >
        {loadingModels ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.btnText}>Fetch Daftar Model</Text>
        )}
      </TouchableOpacity>

      {models.length > 0 && (
        <>
          <Text style={styles.label}>Model ({models.length})</Text>
          <FlatList
            data={models}
            keyExtractor={(item, i) => `${item}-${i}`}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modelItem,
                  model === item && styles.modelItemActive,
                ]}
                onPress={() => setModel(item)}
              >
                <Text
                  style={[
                    styles.modelText,
                    model === item && styles.modelTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      <Text style={styles.label}>Model (bisa diketik manual)</Text>
      <TextInput
        style={styles.input}
        placeholder="mis. gemini-2.0-flash-lite"
        value={model}
        onChangeText={setModel}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.actions}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.btnText}>Simpan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeBtn} onPress={handleRemove}>
          <Text style={styles.removeText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, paddingTop: 60, backgroundColor: "#F8F9FA" },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1A1A1A" },
  headerSubtitle: { fontSize: 14, color: "#666", marginTop: 4, marginBottom: 24 },
  label: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 8, marginTop: 16 },
  row: { flexDirection: "row", gap: 8 },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  segmentActive: { borderColor: "#34A853", backgroundColor: "#E8F5E9" },
  segmentText: { fontSize: 13, color: "#555" },
  segmentTextActive: { color: "#34A853", fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    fontSize: 14,
  },
  fetchBtn: {
    marginTop: 12,
    backgroundColor: "#34A853",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#FFF", fontWeight: "bold" },
  modelItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FFF",
    marginBottom: 6,
  },
  modelItemActive: { borderColor: "#34A853", backgroundColor: "#E8F5E9" },
  modelText: { fontSize: 14, color: "#333" },
  modelTextActive: { color: "#34A853", fontWeight: "bold" },
  actions: { flexDirection: "row", gap: 10, marginTop: 24 },
  saveBtn: {
    flex: 1,
    backgroundColor: "#34A853",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  removeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E53935",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  removeText: { color: "#E53935", fontWeight: "bold" },
});