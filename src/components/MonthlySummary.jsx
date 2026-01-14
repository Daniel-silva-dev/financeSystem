import { generateMonthlySummary } from "../utils/monthlySummary";

export default function MonthlySummary({ transactions }) {
  const summary = generateMonthlySummary(transactions);

  return (
    <section className="monthly-summary">
      <h3>Resumo do mês</h3>

      <p>Receitas: R$ {summary.totalIncome.toFixed(2)}</p>
      <p>Despesas: R$ {summary.totalExpenses.toFixed(2)}</p>
      <p>Obrigatórias: R$ {summary.mandatoryExpenses.toFixed(2)}</p>
      <p>
        Saldo:{" "}
        <strong>
          R$ {summary.balance.toFixed(2)}
        </strong>
      </p>
    </section>
  );
}
