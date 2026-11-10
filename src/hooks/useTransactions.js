
import { useEffect, useState } from "react";

const STORAGE_KEY = "finance_transactions";

function getTodayLocalDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentMonth() {
  return getTodayLocalDate().slice(0, 7);
}

export function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored ? JSON.parse(stored) : [];
  });

  const [month, setMonth] = useState(getCurrentMonth());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Adicionar movimentação
  function addTransaction(data) {
    setTransactions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...data,
        data: data.data || getTodayLocalDate(),
      },
    ]);
  }

  // Editar movimentação
  function updateTransaction(id, data) {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...data }
          : transaction
      )
    );
  }

  // Remover movimentação
  function removeTransaction(id) {
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id)
    );
  }

  // Marcar como importante
  function toggleImportante(id) {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id
          ? {
              ...transaction,
              importante: !transaction.importante,
            }
          : transaction
      )
    );
  }

  // Limpar filtros de período
  function clearDateFilters() {
    setStartDate("");
    setEndDate("");
  }

  // Filtrar movimentações
  const filteredTransactions = transactions.filter((transaction) => {
    const date = transaction.data;

    if (!date) return false;

    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;

    if (startDate || endDate) return true;

    return date.startsWith(month);
  });

  // Totais
  const totalEntradas = filteredTransactions
    .filter((t) => t.tipo === "entrada")
    .reduce((acc, t) => acc + Number(t.valor), 0);

  const totalSaidas = filteredTransactions
    .filter((t) => t.tipo === "saida")
    .reduce((acc, t) => acc + Number(t.valor), 0);

  const saldo = totalEntradas - totalSaidas;

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,

    addTransaction,
    updateTransaction,
    removeTransaction,
    toggleImportante,

    month,
    setMonth,

    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearDateFilters,

    totalEntradas,
    totalSaidas,
    saldo,
  };
}
