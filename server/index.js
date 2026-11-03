
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://financesystem.pages.dev",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("ERRO: GEMINI_API_KEY não foi configurada.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

app.get("/", (req, res) => {
  res.json({ status: "Backend funcionando com Gemini" });
});

app.post("/api/ai-summary", async (req, res) => {
  try {
    const { summary } = req.body;

    if (!summary || typeof summary !== "object") {
      return res.status(400).json({
        error: "Resumo inválido ou não enviado.",
      });
    }

    if (!ai) {
      return res.status(500).json({
        error: "API Key do Gemini não configurada no servidor.",
      });
    }

    const prompt = `
Você é um assistente financeiro profissional.

Analise os dados financeiros abaixo:
${JSON.stringify(summary, null, 2)}

Gere uma análise em português seguindo este formato:

### Visão Geral
Resumo curto do mês.

### Gastos Obrigatórios
- Identifique os principais gastos e seus valores.

### Pontos de Atenção
- Aponte excessos e possíveis problemas.

### Recomendações Práticas
- Sugira ações simples e objetivas.

Regras:
- Use listas e frases curtas.
- Não invente valores ausentes.
- Não repita o JSON.
- Máximo de 600 palavras.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 1000,
      },
    });

    const result = response.text;

    if (!result) {
      throw new Error("A IA retornou uma resposta vazia.");
    }

    return res.json({ result });
  } catch (err) {
    console.error("ERRO NA API DO GEMINI:", {
      message: err.message,
      status: err.status,
      name: err.name,
    });

    return res.status(500).json({
      error: "Falha ao gerar análise. Verifique os logs do servidor.",
    });
  }
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
