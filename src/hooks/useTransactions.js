import { useEffect, useState } from "react";

const STORAGE_KEY = "finance_transactions";

export function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    return stored ? JSON.parse(stored) : [];

  });
  
  function toggleImportante(id) {
  setTransactions(prev =>
    prev.map(transaction =>
      transaction.id === id
        ? { ...transaction, importante: !transaction.importante }
        : transaction
    )
  );
}


    function getCurrentMonth() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() +2 ).padStart(2, "0") ;
    return `${year}-${month }`;
    }

    const [month, setMonth] = useState(getCurrentMonth());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  function addTransaction(data) {
    setTransactions(prev => [
      ...prev,
      { id: crypto.randomUUID(), ...data }
    ]);
  }

  function removeTransaction(id) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  const filteredTransactions = transactions.filter(t =>
    t.data.startsWith(month)
  );

  const totalEntradas = filteredTransactions
    .filter(t => t.tipo === "entrada")
    .reduce((acc, t) => acc + Number(t.valor), 0);

  const totalSaidas = filteredTransactions
    .filter(t => t.tipo === "saida")
    .reduce((acc, t) => acc + Number(t.valor), 0);

  const saldo = totalEntradas - totalSaidas;


  return {
    transactions: filteredTransactions,
    addTransaction,
    removeTransaction,
    month,
    setMonth,
    totalEntradas,
    totalSaidas,
    saldo,
    toggleImportante
  };
}
