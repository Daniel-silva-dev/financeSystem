import SummaryCard from "./SummaryCard";

export default function Dashboard({ entradas, saidas, saldo }) {
  return (
    <section className="dashboard">
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
        title="Saldo do mês"
        value={saldo}
        type="saldo"
      />
    </section>
  );
}
