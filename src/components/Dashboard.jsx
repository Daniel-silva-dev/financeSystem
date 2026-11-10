
import { useMemo } from "react";
import SummaryCard from "./SummaryCard";

const categoryColors = [
  "#648cff",
  "#35c98a",
  "#ffb454",
  "#ff647c",
  "#a78bfa",
  "#22c1c3",
  "#f472b6",
  "#94a3b8",
];

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatMonth(month) {
  const [year, monthNumber] = month.split("-").map(Number);

  return new Date(year, monthNumber - 1, 1).toLocaleDateString("pt-BR", {
    month: "short",
    year: "2-digit",
  });
}

export default function Dashboard({
  entradas,
  saidas,
  saldo,
  transactions = [],
}) {
  const monthlyData = useMemo(() => {
    const validTransactions = transactions.filter((t) => {
      return t.data && /^\d{4}-\d{2}-\d{2}$/.test(t.data);
    });

    if (!validTransactions.length) return [];

    const dates = validTransactions.map((t) => t.data.slice(0, 7)).sort();

    const [startYear, startMonth] = dates[0].split("-").map(Number);
    const [endYear, endMonth] = dates[dates.length - 1]
      .split("-")
      .map(Number);

    const months = [];
    const current = new Date(startYear, startMonth - 1, 1);
    const last = new Date(endYear, endMonth - 1, 1);

    while (current <= last) {
      const key = `${current.getFullYear()}-${String(
        current.getMonth() + 1
      ).padStart(2, "0")}`;

      months.push({
        month: key,
        entradas: 0,
        saidas: 0,
        saldo: 0,
      });

      current.setMonth(current.getMonth() + 1);
    }

    const grouped = Object.fromEntries(
      months.map((item) => [item.month, item])
    );

    validTransactions.forEach((transaction) => {
      const item = grouped[transaction.data.slice(0, 7)];
      const value = Number(transaction.valor) || 0;

      if (transaction.tipo === "entrada") {
        item.entradas += value;
      } else if (transaction.tipo === "saida") {
        item.saidas += value;
      }
    });

    return months.map((item) => ({
      ...item,
      saldo: item.entradas - item.saidas,
    }));
  }, [transactions]);

  const maxMonthlyValue = Math.max(
    1,
    ...monthlyData.flatMap((item) => [
      item.entradas,
      item.saidas,
      Math.abs(item.saldo),
    ])
  );

  const categoryData = useMemo(() => {
    const categories = {};

    transactions.forEach((transaction) => {
      if (transaction.tipo !== "saida") return;

      const category = transaction.categoria?.trim() || "Sem categoria";
      const value = Number(transaction.valor) || 0;

      categories[category] = (categories[category] || 0) + value;
    });

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalExpenses = categoryData.reduce(
    (total, item) => total + item.value,
    0
  );

  let accumulatedPercentage = 0;

  const chartGradient = categoryData.length
    ? categoryData
        .map((item, index) => {
          const percentage =
            totalExpenses > 0 ? (item.value / totalExpenses) * 100 : 0;

          const start = accumulatedPercentage;
          accumulatedPercentage += percentage;

          return `${categoryColors[index % categoryColors.length]} ${start}% ${accumulatedPercentage}%`;
        })
        .join(", ")
    : "var(--border) 0% 100%";

  return (
    <section className="dashboard-container">
      <div className="dashboard">
        <SummaryCard title="Entradas" value={entradas} type="entrada" />
        <SummaryCard title="Saídas" value={saidas} type="saida" />
        <SummaryCard title="Saldo do mês" value={saldo} type="saldo" />
      </div>

      <div className="charts-grid">
        <section className="chart-card monthly-chart">
          <div className="chart-header">
            <div>
              <h3>Evolução mensal</h3>
              <p>Histórico de entradas, saídas e saldo</p>
            </div>
          </div>

          {monthlyData.length === 0 ? (
            <div className="chart-empty">
              Nenhuma movimentação registrada.
            </div>
          ) : (
            <>
              <div className="chart-legend">
                <span><i className="legend-entry" /> Entradas</span>
                <span><i className="legend-exit" /> Saídas</span>
                <span><i className="legend-balance" /> Saldo</span>
              </div>

              <div className="monthly-chart-scroll">
                <div className="monthly-chart-content">
                  {monthlyData.map((item) => (
                    <div className="month-column" key={item.month}>
                      <div className="month-bars">
                        <div
                          className="bar entry-bar"
                          style={{
                            height: `${(item.entradas / maxMonthlyValue) * 100}%`,
                          }}
                          title={`Entradas: ${formatCurrency(item.entradas)}`}
                        />

                        <div
                          className="bar exit-bar"
                          style={{
                            height: `${(item.saidas / maxMonthlyValue) * 100}%`,
                          }}
                          title={`Saídas: ${formatCurrency(item.saidas)}`}
                        />

                        <div
                          className={`bar balance-bar ${
                            item.saldo < 0 ? "negative-bar" : ""
                          }`}
                          style={{
                            height: `${(Math.abs(item.saldo) / maxMonthlyValue) * 100}%`,
                          }}
                          title={`Saldo: ${formatCurrency(item.saldo)}`}
                        />
                      </div>

                      <span className="month-label-chart">
                        {formatMonth(item.month)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-note">
                <span>{monthlyData.length} meses registrados</span>
                <span>Saldo negativo em vermelho</span>
              </div>
            </>
          )}
        </section>

        <section className="chart-card category-chart">
          <div className="chart-header">
            <div>
              <h3>Despesas por categoria</h3>
              <p>Distribuição dos gastos registrados</p>
            </div>
          </div>

          {categoryData.length === 0 ? (
            <div className="chart-empty">
              Nenhuma despesa registrada.
            </div>
          ) : (
            <>
              <div className="donut-container">
                <div
                  className="donut-chart"
                  style={{ background: `conic-gradient(${chartGradient})` }}
                >
                  <div className="donut-center">
                    <span>Total de saídas</span>
                    <strong>{formatCurrency(totalExpenses)}</strong>
                  </div>
                </div>
              </div>

              <div className="category-list">
                {categoryData.map((item, index) => {
                  const percentage =
                    (item.value / totalExpenses) * 100;

                  return (
                    <div className="category-item" key={item.name}>
                      <div className="category-name">
                        <i
                          style={{
                            background:
                              categoryColors[index % categoryColors.length],
                          }}
                        />
                        <span>{item.name}</span>
                      </div>

                      <div className="category-values">
                        <strong>{formatCurrency(item.value)}</strong>
                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </section>
  );
}
