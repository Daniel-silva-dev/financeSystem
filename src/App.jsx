import { useTransactions } from "./hooks/useTransactions";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import MonthSelector from "./components/MonthSelector";
import Dashboard from "./components/Dashboard";

function App() {
  const {
    transactions,
    addTransaction,
    removeTransaction,
    month,
    setMonth,
    saldo,
    totalEntradas,
    totalSaidas
  } = useTransactions();

  return (
    <div>
      <h1>Controle Financeiro</h1>

      <MonthSelector month={month} setMonth={setMonth} />

      <Dashboard
        entradas={totalEntradas}
        saidas={totalSaidas}
        saldo={saldo}
      />

      <TransactionForm onSubmit={addTransaction} />

      <TransactionList
        transactions={transactions}
        onRemove={removeTransaction}
      />
    </div>
  );
}

export default App;
