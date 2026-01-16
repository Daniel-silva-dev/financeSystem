import { useState } from "react";
import { generateMonthlySummary } from "../utils/monthlySummary";
import ReactMarkdown from "react-markdown";

export default function AISummary({ transactions }) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");

    try {
      const summary = generateMonthlySummary(transactions);

      const response = await fetch("http://localhost:3333/api/ai-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ summary })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setResult(data.result);
    } catch (err) {
      setError("Erro ao conectar com o servidor: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id='resumo' className="ai-summary-container">
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
