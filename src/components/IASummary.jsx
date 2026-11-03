
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { generateMonthlySummary } from "../utils/monthlySummary";

const API_URL = "https://financesystem-sld9.onrender.com/api/ai-summary";

export default function AISummary({ transactions }) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const summary = generateMonthlySummary(transactions);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ summary }),
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `O servidor retornou uma resposta inválida (HTTP ${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || `Erro HTTP ${response.status}`
        );
      }

      if (!data.result) {
        throw new Error("O servidor não retornou a análise da IA.");
      }

      setResult(data.result);
    } catch (err) {
      console.error("Erro na análise com IA:", err);

      setError(
        err.message === "Failed to fetch"
          ? "Não foi possível conectar ao servidor. Verifique o Render e o CORS."
          : err.message || "Erro inesperado ao gerar a análise."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="resumo" className="ai-summary-container">
      <h3 className="ai-title">Resumo inteligente</h3>

      <button
        className="ai-button"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? (
          <span className="loading-text">
            Analisando<span className="dots"></span>
          </span>
        ) : (
          "Gerar análise com IA"
        )}
      </button>

      {error && <p className="ai-error">{error}</p>}

      {result && (
        <div className="ai-result">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
    </section>
  );
}
