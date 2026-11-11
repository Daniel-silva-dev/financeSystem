
import { useMemo, useState } from "react";
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

const periodOptions = [
  { value: "3", label: "Últimos 3 meses" },
  { value: "6", label: "Últimos 6 meses" },
  { value: "12", label: "Últimos 12 meses" },
  { value: "24", label: "Últimos 24 meses" },
  { value: "36", label: "Últimos 36 meses" },
  { value: "all", label: "Todo o histórico" },
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

function getCurrentMonth() {
  const today = new Date();

  return `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;
}

function buildLinePath(points) {
  if (!points.length) return "";

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  return points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const previous = points[index - 1];
    const middleX = (previous.x + point.x) / 2;

    return `${path} Q ${middleX} ${previous.y}, ${middleX} ${
      (previous.y + point.y) / 2
    } T ${point.x} ${point.y}`;
  }, "");
}

export default function Dashboard({
  entradas,
  saidas,
  saldo,
  transactions = [],
}) {
  const [selectedPeriod, setSelectedPeriod] = useState("12");

  // AGRUPAMENTO MENSAL E SALDO ACUMULADO

  const monthlyHistory = useMemo(() => {
    const validTransactions = transactions.filter(
      (transaction) =>
        transaction.data &&
        /^\d{4}-\d{2}-\d{2}$/.test(transaction.data)
    );

    const currentMonth = getCurrentMonth();

    const dates = validTransactions
      .map((transaction) => transaction.data.slice(0, 7))
      .filter((month) => month <= currentMonth)
      .sort();

    if (!dates.length) return [];

    const [startYear, startMonth] = dates[0].split("-").map(Number);
    const [endYear, endMonth] = currentMonth.split("-").map(Number);

    const grouped = {};

    const current = new Date(startYear, startMonth - 1, 1);
    const last = new Date(endYear, endMonth - 1, 1);

    while (current <= last) {
      const key = `${current.getFullYear()}-${String(
        current.getMonth() + 1
      ).padStart(2, "0")}`;

      grouped[key] = {
        month: key,
        entradas: 0,
        saidas: 0,
        saldo: 0,
        acumulado: 0,
      };

      current.setMonth(current.getMonth() + 1);
    }

    validTransactions.forEach((transaction) => {
      const month = transaction.data.slice(0, 7);
      const item = grouped[month];

      if (!item) return;

      const value = Number(transaction.valor) || 0;

      if (transaction.tipo === "entrada") {
        item.entradas += value;
      } else if (transaction.tipo === "saida") {
        item.saidas += value;
      }
    });

    let accumulated = 0;

    return Object.values(grouped).map((item) => {
      const monthlyBalance = item.entradas - item.saidas;

      accumulated += monthlyBalance;

      return {
        ...item,
        saldo: monthlyBalance,
        acumulado: accumulated,
      };
    });
  }, [transactions]);

  // FILTRO DE PERÍODO

  const monthlyData = useMemo(() => {
    if (selectedPeriod === "all") {
      return monthlyHistory;
    }

    const quantity = Number(selectedPeriod);

    const end = new Date();
    const start = new Date(
      end.getFullYear(),
      end.getMonth() - quantity + 1,
      1
    );

    const result = [];

    for (let index = 0; index < quantity; index++) {
      const date = new Date(
        start.getFullYear(),
        start.getMonth() + index,
        1
      );

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const existing = monthlyHistory.find(
        (item) => item.month === key
      );

      result.push(
        existing || {
          month: key,
          entradas: 0,
          saidas: 0,
          saldo: 0,
          acumulado: 0,
        }
      );
    }

    return result;
  }, [monthlyHistory, selectedPeriod]);

  const maxMonthlyValue = Math.max(
    1,
    ...monthlyData.flatMap((item) => [
      item.entradas,
      item.saidas,
      Math.abs(item.saldo),
    ])
  );

  // DESPESAS POR CATEGORIA

  const categoryData = useMemo(() => {
    const categories = {};

    transactions.forEach((transaction) => {
      if (transaction.tipo !== "saida") return;

      const category =
        transaction.categoria?.trim() || "Sem categoria";

      const value = Number(transaction.valor) || 0;

      categories[category] =
        (categories[category] || 0) + value;
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
            totalExpenses > 0
              ? (item.value / totalExpenses) * 100
              : 0;

          const start = accumulatedPercentage;
          accumulatedPercentage += percentage;

          return `${categoryColors[index % categoryColors.length]} ${start}% ${accumulatedPercentage}%`;
        })
        .join(", ")
    : "var(--border) 0% 100%";

  // GRÁFICO DE SALDO ACUMULADO

  const linePoints = useMemo(() => {
    if (!monthlyData.length) return [];

    const width = 720;
    const height = 220;
    const paddingX = 12;
    const paddingY = 20;

    const values = monthlyData.map((item) => item.acumulado);

    let minValue = Math.min(0, ...values);
    let maxValue = Math.max(0, ...values);

    if (minValue === maxValue) {
      maxValue += 1;
      minValue -= 1;
    }

    const range = maxValue - minValue;

    return monthlyData.map((item, index) => ({
      ...item,
      x:
        monthlyData.length === 1
          ? width / 2
          : paddingX +
            (index / (monthlyData.length - 1)) *
              (width - paddingX * 2),
      y:
        paddingY +
        ((maxValue - item.acumulado) / range) *
          (height - paddingY * 2),
    }));
  }, [monthlyData]);

  const linePath = buildLinePath(linePoints);

  const areaPath = linePoints.length
    ? `${linePath} L ${linePoints[linePoints.length - 1].x} 220 L ${linePoints[0].x} 220 Z`
    : "";

  return (
    <section className="dashboard-container">
      {/* CARDS */}

      <div className="dashboard">
        <SummaryCard
          title="Entradas"
          value={entradas}
          type="entrada"
        />

        <SummaryCard
          title="Saídas"
          value={saidas}
          type="saida"
        />

        <SummaryCard
          title="Saldo total"
          value={saldo}
          type="saldo"
        />
      </div>

      {/* GRÁFICOS */}

      <div className="charts-grid">
        {/* EVOLUÇÃO MENSAL */}

        <section className="chart-card monthly-chart">
          <div className="chart-header">
            <div>
              <h3>Evolução mensal</h3>
              <p>Entradas, saídas e saldo por mês</p>
            </div>

            <select
              className="chart-period-select"
              value={selectedPeriod}
              onChange={(e) =>
                setSelectedPeriod(e.target.value)
              }
              aria-label="Período do gráfico"
            >
              {periodOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {monthlyData.length === 0 ? (
            <div className="chart-empty">
              Nenhuma movimentação registrada.
            </div>
          ) : (
            <>
              <div className="chart-legend">
                <span>
                  <i className="legend-entry" />
                  Entradas
                </span>

                <span>
                  <i className="legend-exit" />
                  Saídas
                </span>

                <span>
                  <i className="legend-balance" />
                  Saldo
                </span>
              </div>

              <div className="monthly-chart-scroll">
                <div className="monthly-chart-content">
                  {monthlyData.map((item) => (
                    <div
                      className="month-column"
                      key={item.month}
                    >
                      <div className="month-bars">
                        <div
                          className="bar entry-bar"
                          style={{
                            height: `${
                              (item.entradas / maxMonthlyValue) *
                              100
                            }%`,
                          }}
                          title={`Entradas: ${formatCurrency(
                            item.entradas
                          )}`}
                        />

                        <div
                          className="bar exit-bar"
                          style={{
                            height: `${
                              (item.saidas / maxMonthlyValue) *
                              100
                            }%`,
                          }}
                          title={`Saídas: ${formatCurrency(
                            item.saidas
                          )}`}
                        />

                        <div
                          className={`bar balance-bar ${
                            item.saldo < 0 ? "negative-bar" : ""
                          }`}
                          style={{
                            height: `${
                              (Math.abs(item.saldo) /
                                maxMonthlyValue) *
                              100
                            }%`,
                          }}
                          title={`Saldo: ${formatCurrency(
                            item.saldo
                          )}`}
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
                <span>
                  {monthlyData.length} meses exibidos
                </span>

                <span>
                  Último mês: {formatMonth(
                    monthlyData[monthlyData.length - 1].month
                  )}
                </span>
              </div>
            </>
          )}
        </section>
        
        {/* DESPESAS POR CATEGORIA */}

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
                  style={{
                    background: `conic-gradient(${chartGradient})`,
                  }}
                >
                  <div className="donut-center">
                    <span>Total de saídas</span>
                    <strong>
                      {formatCurrency(totalExpenses)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="category-list">
                {categoryData.map((item, index) => {
                  const percentage =
                    (item.value / totalExpenses) * 100;

                  return (
                    <div
                      className="category-item"
                      key={item.name}
                    >
                      <div className="category-name">
                        <i
                          style={{
                            background:
                              categoryColors[
                                index % categoryColors.length
                              ],
                          }}
                        />

                        <span>{item.name}</span>
                      </div>

                      <div className="category-values">
                        <strong>
                          {formatCurrency(item.value)}
                        </strong>

                        <span>
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* SALDO ACUMULADO */}

        <section className="chart-card mountain-chart">
          <div className="chart-header">
            <div>
              <h3>Saldo acumulado</h3>
              <p>Evolução do patrimônio ao longo do tempo</p>
            </div>
          </div>

          {linePoints.length === 0 ? (
            <div className="chart-empty">
              Nenhuma movimentação registrada.
            </div>
          ) : (
            <>
              <div className="mountain-total">
                <span>Saldo acumulado atual</span>

                <strong
                  className={
                    linePoints[linePoints.length - 1].acumulado < 0
                      ? "negative-total"
                      : ""
                  }
                >
                  {formatCurrency(
                    linePoints[linePoints.length - 1].acumulado
                  )}
                </strong>
              </div>

              <div className="mountain-chart-container">
                <svg
                  viewBox="0 0 720 220"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="Gráfico de evolução do saldo acumulado"
                >
                  <defs>
                    <linearGradient
                      id="mountain-gradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#648cff"
                        stopOpacity="0.35"
                      />

                      <stop
                        offset="100%"
                        stopColor="#648cff"
                        stopOpacity="0.01"
                      />
                    </linearGradient>
                  </defs>

                  {[0, 1, 2, 3].map((index) => (
                    <line
                      key={index}
                      x1="0"
                      x2="720"
                      y1={20 + index * 60}
                      y2={20 + index * 60}
                      className="mountain-grid-line"
                    />
                  ))}

                  <path
                    d={areaPath}
                    fill="url(#mountain-gradient)"
                  />

                  <path
                    d={linePath}
                    className="mountain-line"
                  />

                  {linePoints.map((point) => (
                    <circle
                      key={point.month}
                      cx={point.x}
                      cy={point.y}
                      r="3"
                      className="mountain-point"
                    >
                      <title>
                        {formatMonth(point.month)}:{" "}
                        {formatCurrency(point.acumulado)}
                      </title>
                    </circle>
                  ))}
                </svg>
              </div>

              <div className="mountain-labels">
                {linePoints
                  .filter((point, index) => {
                    const interval = Math.ceil(
                      linePoints.length / 6
                    );

                    return (
                      index % interval === 0 ||
                      index === linePoints.length - 1
                    );
                  })
                  .map((point) => (
                    <span key={point.month}>
                      {formatMonth(point.month)}
                    </span>
                  ))}
              </div>

              <div className="mountain-description">
                O saldo considera todas as entradas e saídas
                desde o primeiro registro até o mês atual.
              </div>
            </>
          )}
        </section>
      </div>
    </section>
  );
}
