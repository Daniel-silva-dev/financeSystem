
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

const PORT = process.env.PORT || 3333;
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("ERRO: GEMINI_API_KEY não configurada.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Aguarda um determinado período
function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Tenta gerar conteúdo novamente em caso de instabilidade
async function gerarComRetry(model, prompt) {
  const tentativas = 3;
  const intervalos = [2000, 5000];

  for (let tentativa = 0; tentativa < tentativas; tentativa++) {
    try {
      console.log(
        `Tentando modelo ${model} - tentativa ${tentativa + 1}`
      );

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          maxOutputTokens: 1000,
        },
      });

      if (!response.text) {
        throw new Error("A IA retornou uma resposta vazia.");
      }

      console.log(`Modelo ${model} respondeu com sucesso.`);

      return response;
    } catch (error) {
      const status = Number(error.status);

      console.error(`Erro no modelo ${model}:`, {
        tentativa: tentativa + 1,
        status,
        message: error.message,
      });

      // Só tenta novamente em erros temporários
      if (status !== 503 && status !== 429 && status !== 500) {
        throw error;
      }

      if (tentativa < tentativas - 1) {
        await esperar(intervalos[tentativa]);
      }
    }
  }

  throw new Error(`Modelo ${model} indisponível após ${tentativas} tentativas.`);
}

// Rota para verificar se o servidor está funcionando
app.get("/", (req, res) => {
  res.json({
    status: "Backend funcionando",
    ai: ai ? "Configurada" : "Não configurada",
  });
});

// Rota de análise financeira
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
Resumo curto da situação financeira.

### Gastos Obrigatórios
- Identifique os principais gastos e seus valores.

### Pontos de Atenção
- Aponte excessos e possíveis problemas financeiros.

### Recomendações Práticas
- Sugira ações simples e objetivas para melhorar as finanças.

Regras:
- Use listas e frases curtas.
- Não invente valores ausentes.
- Não repita o JSON.
- Considere apenas os dados recebidos.
- Máximo de 600 palavras.
`;

    let response;

    // Primeiro tenta o modelo principal
    try {
      response = await gerarComRetry(
        "gemini-3.8-flash",
        prompt
      );
    } catch (errorPrincipal) {
      console.error(
        "Modelo principal indisponível. Iniciando fallback."
      );

      // Tenta o modelo alternativo
      response = await gerarComRetry(
        "gemini-3.5-flash-lite",
        prompt
      );
    }

    return res.json({
      result: response.text,
    });

  } catch (error) {
    console.error("ERRO NA API DO GEMINI:", {
      message: error.message,
      status: error.status,
      name: error.name,
    });

    return res.status(500).json({
      error: "Não foi possível gerar a análise financeira. Tente novamente mais tarde.",
    });
  }
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
