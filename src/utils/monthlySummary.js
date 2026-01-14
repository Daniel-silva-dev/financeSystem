export function generateMonthlySummary(transactions) {
  const income = transactions
    .filter(t => t.tipo === "entrada")
    .reduce((acc, t) => acc + t.valor, 0);

  const expenses = transactions
    .filter(t => t.tipo === "saida")
    .reduce((acc, t) => acc + t.valor, 0);

  const mandatoryExpenses = transactions
    .filter(t => t.tipo === "saida" && t.importante)
    .reduce((acc, t) => acc + t.valor, 0);

  const categories = {};

  transactions
    .filter(t => t.tipo === "saida")
    .forEach(t => {
      categories[t.categoria] =
        (categories[t.categoria] || 0) + t.valor;
    });

  return {
    totalIncome: income,
    totalExpenses: expenses,
    mandatoryExpenses,
    balance: income - expenses,
    categories
  };
}
