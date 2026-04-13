import { askAI } from "./aiService";

export async function FinancialPlanningService(message, context) {
  async function saranKategorisasi(userContext, deskripsi) {
    const systemInstruction = `
    Identitas: Arus Dana AI. 
    Tugas: Klasifikasi transaksi keuangan.
    Format: Kategori tunggal dari daftar yang ditentukan.
    `;
    const fullPrompt = `${systemInstruction}\n\nBerikan kategori yang tepat untuk transaksi dengan deskripsi: "${deskripsi}"\nKategori yang tersedia: Makanan, Utilitas, Transportasi, Hiburan, Belanja, Kesehatan, Pendidikan, Lainnya.`;
    try {
      return await askAI(fullPrompt, userContext);
    } catch (e) {
      console.error("FinancialPlanningService Error:", error);
      return "Waduh, saya gagal menganalisis data kamu. Coba lagi nanti ya!";
    }
  }
}
