import { GOOGLE_API_KEY } from "@env";

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

export async function askAI(messages, context, imageBase64 = null) {
  const systemInstruction = `
Kamu adalah Analis Keuangan AI untuk aplikasi Arus Dana.
...
### Langkah 3 — Format Respons
Tulis konfirmasi singkat kepada user, lalu di baris terakhir sertakan blok data:
###DATA_START###{"nominal": 15000, "deskripsi": "Beli sate", "type": "makan", "tanggal": "2025-01-15", "jam": "13:45"}###DATA_END###

ATURAN PENTING:
- Tulis JSON secara mentah, JANGAN gunakan blok kode Markdown (json)
- Tulis tepat seperti format di atas.`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: `System: ${systemInstruction} \n\n Data Konteks: ${context || ""} \n\n User: ${messages}` },
          ...(imageBase64
            ? [
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64,
                  },
                },
              ]
            : []),
        ],
      },
    ],
  };

  const response = await fetch(`${ENDPOINT}?key=${GOOGLE_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Google AI error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const textResponse = data.candidates[0].content.parts[0].text.trim();
  console.log("AI Raw Response:", textResponse); // Debugging
  return textResponse;
}
