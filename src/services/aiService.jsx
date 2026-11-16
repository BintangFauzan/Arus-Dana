import { GOOGLE_API_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@ai_config";
const DEFAULT_MODEL = "gemini-3.1-flash-lite";

const PROVIDERS = {
  gemini: {
    label: "Google Gemini",
    buildUrl: (cfg) =>
      `https://generativelanguage.googleapis.com/v1beta/models/${cfg.model || DEFAULT_MODEL}:generateContent`,
    listUrl: () => "https://generativelanguage.googleapis.com/v1beta/models",
    format: "gemini",
    auth: { in: "query", param: "key" },
  },
  openrouter: {
    label: "OpenRouter",
    buildUrl: () => "https://openrouter.ai/api/v1/chat/completions",
    listUrl: () => "https://openrouter.ai/api/v1/models",
    format: "openai",
    auth: { in: "header", name: "Authorization", value: (k) => `Bearer ${k}` },
    extraHeaders: {
      "HTTP-Referer": "https://arus-dana.app",
      "X-Title": "Arus Dana",
    },
  },
  custom: {
    label: "Custom URL",
    buildUrl: (cfg) => (cfg.baseUrl || "").replace(/\/+$/, "") || "",
    listUrl: (cfg) => `${(cfg.baseUrl || "").replace(/\/+$/, "")}/models`,
    format: "openai",
    auth: { in: "header", name: "Authorization", value: (k) => `Bearer ${k}` },
  },
};

export async function loadAiConfig() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export async function saveAiConfig(cfg) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

export async function fetchModels(cfg) {
  const p = PROVIDERS[cfg.provider] || PROVIDERS.gemini;
  let finalUrl = p.listUrl(cfg);
  const headers = { "Content-Type": "application/json" };

  if (p.auth.in === "header") {
    headers[p.auth.name] = p.auth.value(cfg.apiKey);
    if (p.extraHeaders) Object.assign(headers, p.extraHeaders);
  } else if (p.auth.in === "query") {
    finalUrl = `${finalUrl}?key=${cfg.apiKey}`;
  }

  const res = await fetch(finalUrl, { headers });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Gagal mengambil model: ${res.status} ${txt}`);
  }
  const data = await res.json();

  if (cfg.provider === "gemini") {
    return (data.models || []).map((m) => m.name.replace(/^models\//, ""));
  }
  return (data.data || []).map((m) => m.id).filter(Boolean);
}

function systemInstruction() {
  return `
Kamu adalah Analis Keuangan AI untuk aplikasi Arus Dana.
...
### Langkah 3 — Format Respons
Tulis konfirmasi singkat kepada user, lalu di baris terakhir sertakan blok data:
###DATA_START###{"nominal": 15000, "deskripsi": "Beli sate", "type": "makan", "tanggal": "2025-01-15", "jam": "13:45"}###DATA_END###

ATURAN PENTING:
- Tulis JSON secara mentah, JANGAN gunakan blok kode Markdown (json)
- Tulis tepat seperti format di atas.`;
}

function buildGeminiBody(sysInstr, context, userMsg, imageBase64) {
  const parts = [
    {
      text: `System: ${sysInstr} \n\n Data Konteks: ${context || ""} \n\n User: ${userMsg}`,
    },
  ];
  if (imageBase64) {
    parts.push({ inline_data: { mime_type: "image/jpeg", data: imageBase64 } });
  }
  return { contents: [{ role: "user", parts }] };
}

function buildOpenAIBody(sysInstr, context, userMsg, model, imageBase64) {
  const contentUser = imageBase64
    ? [
        { type: "text", text: userMsg },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
      ]
    : userMsg;
  return {
    model,
    messages: [
      { role: "system", content: `${sysInstr}\n\nData Konteks: ${context || ""}` },
      { role: "user", content: contentUser },
    ],
  };
}

export async function askAI(messages, context, imageBase64 = null) {
  const cfg = await loadAiConfig();
  const providerKey = cfg.provider || "gemini";
  const p = PROVIDERS[providerKey] || PROVIDERS.gemini;
  const model = cfg.model || DEFAULT_MODEL;

  const effectiveKey =
    cfg.apiKey || (providerKey === "gemini" ? GOOGLE_API_KEY : "");
  if (!effectiveKey) {
    throw new Error(
      "API Key belum diatur. Buka Settings dan masukkan API Key terlebih dahulu."
    );
  }

  const sysInstr = systemInstruction();
  const url = p.buildUrl({ ...cfg, model });
  const headers = { "Content-Type": "application/json" };
  let finalUrl = url;

  if (p.auth.in === "header") {
    headers[p.auth.name] = p.auth.value(effectiveKey);
    if (p.extraHeaders) Object.assign(headers, p.extraHeaders);
  } else if (p.auth.in === "query") {
    const sep = url.includes("?") ? "&" : "?";
    finalUrl = `${url}${sep}${p.auth.param}=${effectiveKey}`;
  }

  const body =
    p.format === "gemini"
      ? buildGeminiBody(sysInstr, context, messages, imageBase64)
      : buildOpenAIBody(sysInstr, context, messages, model, imageBase64);

  const response = await fetch(finalUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => "");
    throw new Error(`AI error (${providerKey}): ${response.status} ${err}`);
  }

  const data = await response.json();
  if (p.format === "gemini") {
    return data.candidates[0].content.parts[0].text.trim();
  }
  return data.choices[0].message.content.trim();
}
