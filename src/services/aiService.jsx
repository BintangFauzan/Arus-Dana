import { OPENROUTER_API_KEY } from "@env";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "arcee-ai/trinity-large-preview:free";

export async function askAI(messages, context) {
  const body = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "Kamu adalah asisten keuangan pribadi. Jawab pertanyaan pengguna menggunakan data keuangan yang diberikan. Berikan jawaban singkat, ramah, dalam Bahasa Indonesia.",
      },
      ...(context
        ? [{ role: "system", content: `Data keuangan pengguna: ${context}` }]
        : []),
      { role: "user", content: messages },
    ],
    temperature: 0.7,
    max_tokens: 500,
  };

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/BintangFauzan/Arus-Dana",
      "X-Title": "Arus Dana App",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Openrouter error: ${response.status} ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim() ?? "";
}
