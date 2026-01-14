import { useState } from "react";
import { generateMonthlySummary } from "../utils/monthlySummary";

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
      setError("Erro ao conectar com o servidor" + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="monthly-summary">
      <h3>Resumo inteligente</h3>

      <button onClick={handleGenerate}>
        Gerar análise com IA
      </button>

      {loading && <p>Analisando...</p>}
      {error && <p className="error">{error}</p>}
      {result && <p>{result}</p>}
    </section>
  );
}
