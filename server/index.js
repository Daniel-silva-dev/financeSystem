import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";

dotenv.config();

/* 🔍 DEBUG */
console.log("🚀 INDEX CORRETO CARREGADO");
console.log("HF_API_KEY TYPE:", typeof process.env.HF_API_KEY);

const app = express();
app.use(
  cors({
    origin: "https://daniel-silva-dev.github.io",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json());

const hf = new HfInference(process.env.HF_API_KEY);

app.post("/api/ai-summary", async (req, res) => {
  try {
    const { summary } = req.body;

    /* ✅ VALIDA PRIMEIRO */
    if (!summary || typeof summary !== "object") {
      return res.status(400).json({ error: "Resumo inválido ou não enviado" });
    }

    /* ✅ TRANSFORMA OBJETO EM TEXTO QUE IA ENTENDE */
    const summaryText = JSON.stringify(summary, null, 2);
      const prompt = `
      Você é um assistente financeiro profissional.

      Abaixo está um resumo financeiro em formato JSON:
      ${summaryText}

      Gere uma análise ORGANIZADA seguindo exatamente este formato:

      ### 📊 Visão Geral
      (resumo curto do mês)

      ### 💸 Gastos Obrigatórios
      - item: valor
      - item: valor

      ### ⚠️ Pontos de Atenção
      - excessos ou alertas claros

      ### ✅ Recomendações Práticas
      - ações simples e objetivas

      Regras:
      - Use listas
      - Frases curtas
      - Português claro
      - Não repita os dados em JSON
      - o resumo deve ter no máximo 600 palavras
      `;


    const response = await hf.chatCompletion({
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 600
    });

    const result =
      response?.choices?.[0]?.message?.content ??
      "Não foi possível gerar a análise.";

    res.json({ result });
  } catch (err) {
    console.error("BACKEND ERROR:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
app.get("/", (req, res) => {
  res.send("API ONLINE 🚀");
});


