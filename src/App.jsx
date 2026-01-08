import { useTransactions } from "./hooks/useTransactions";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import MonthSelector from "./components/MonthSelector";

function App() {
  const {
    transactions,
    addTransaction,
    removeTransaction,
    month,
    setMonth,
    saldo
  } = useTransactions();

  return (
    <div>
      <h1>Controle Financeiro</h1>

      <MonthSelector month={month} setMonth={setMonth} />

      <TransactionForm onSubmit={addTransaction} />

      <p>
        Saldo do mês: R${" "}
        {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </p>

      <TransactionList
        transactions={transactions}
        onRemove={removeTransaction}
      />
    </div>
  );
}

export default App;
