
import { useTransactions } from "./hooks/useTransactions";

import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import MonthSelector from "./components/MonthSelector";
import Dashboard from "./components/Dashboard";
import AISummary from "./components/IASummary";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SupportSection from "./components/SupportSection";

function App() {
  const {
    transactions,
    allTransactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
    month,
    setMonth,
    saldo,
    totalEntradas,
    totalSaidas,
    toggleImportante,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearDateFilters,
  } = useTransactions();

  const usingDateFilter = startDate || endDate;

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <section className="filters-container">
          <MonthSelector
            month={month}
            setMonth={setMonth}
          />

          <section className="date-filter">
            <h3>Filtrar por período</h3>

            <div className="date-filter-fields">
              <div className="date-filter-input">
                <label htmlFor="startDate">Data inicial</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="date-filter-input">
                <label htmlFor="endDate">Data final</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {usingDateFilter && (
                <button
                  type="button"
                  onClick={clearDateFilters}
                  className="clear-date-filter"
                >
                  Limpar filtro
                </button>
              )}
            </div>
          </section>
        </section>

        <Dashboard
          entradas={totalEntradas}
          saidas={totalSaidas}
          saldo={saldo}
          transactions={allTransactions}
        />

        <TransactionForm onSubmit={addTransaction} />

        <TransactionList
          transactions={transactions}
          onRemove={removeTransaction}
          onToggleImportante={toggleImportante}
          onEdit={updateTransaction}
        />

        <AISummary transactions={transactions} />

        <SupportSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;
