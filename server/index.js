import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";

dotenv.config();

/* 🔍 DEBUG CRÍTICO */
console.log("🚀 INDEX CORRETO CARREGADO");
console.log("HF_API_KEY TYPE:", typeof process.env.HF_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

/* ✅ CLIENTE HF CORRETO */
const hf = new HfInference(process.env.HF_API_KEY);

app.post("/api/ai-summary", async (req, res) => {
  try {
    const { summary } = req.body;

    if (!summary) {
      return res.status(400).json({ error: "Resumo não enviado" });
    }

    const prompt = `
Você é um assistente financeiro pessoal.

Resumo financeiro do mês:
${summary}

Tarefas:
- Gere uma análise clara e objetiva
- Destaque gastos obrigatórios
- Identifique excessos
- Sugira melhorias práticas para o próximo mês
`;

    /* 🧠 CHAMADA DE IA FUNCIONAL */
    const response = await hf.chatCompletion({
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: [
        {
          role: "system",
          content: "Você é um assistente financeiro pessoal."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300
    });

    const result =
      response?.choices?.[0]?.message?.content ||
      "Não foi possível gerar a análise.";

    res.json({ result });
  } catch (err) {
    console.error("BACKEND ERROR:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.listen(3333, () => {
  console.log("🧠 IA Server rodando na porta 3333");
});
