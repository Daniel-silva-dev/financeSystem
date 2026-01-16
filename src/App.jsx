import { useTransactions } from "./hooks/useTransactions";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import MonthSelector from "./components/MonthSelector";
import Dashboard from "./components/Dashboard";
import AISummary from "./components/IASummary";
import Header from "./components/Header";
import Footer from "./components/Footer";


function App() {
  const {
    transactions,
    addTransaction,
    removeTransaction,
    month,
    setMonth,
    saldo,
    totalEntradas,
    totalSaidas,
    toggleImportante
  } = useTransactions();

  return (
    <div>
      <Header />

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
        onToggleImportante={toggleImportante}
      />
      <AISummary transactions={transactions} />

      <Footer />
    </div>
  );
}

export default App;
