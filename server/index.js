import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const HF_URL =
  "https://router.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

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

   
const response = await fetch(HF_URL, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.HF_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    inputs: [
      {
        role: "user",
        content: prompt
      }
    ],
    parameters: {
      max_new_tokens: 300
    }
  })
});



    // 🔐 PROTEÇÃO CONTRA "Not Found"
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Resposta não-JSON da IA:", text);
      return res.json({
        result:
          "A IA não respondeu corretamente. Tente novamente em instantes."
      });
    }

    console.log("HF RESPONSE:", data);

    // 🟡 Cold start
    if (data?.error || data?.estimated_time) {
      return res.json({
        result:
          "A IA está inicializando. Aguarde alguns segundos e tente novamente."
      });
    }

    // 🟢 Resposta válida
    if (Array.isArray(data) && data[0]?.generated_text) {
      return res.json({
        result: data[0].generated_text.trim()
      });
    }

    // 🔴 Fallback
    return res.json({
      result: "Não foi possível gerar a análise no momento."
    });
  } catch (err) {
    console.error("BACKEND ERROR:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.listen(3333, () => {
  console.log("🧠 IA Server rodando na porta 3333");
  console.log(
    "HF KEY LOADED:",
    process.env.HF_API_KEY ? "SIM" : "NÃO"
  );
});

