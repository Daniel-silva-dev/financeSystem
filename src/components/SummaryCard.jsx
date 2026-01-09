export default function SummaryCard({ title, value, type }) {
  const saldoNegativo = type === "saldo" && value < 0;

  return (
    <div className={`card ${type}`}>
      <p className="card-title">{title}</p>

      <strong
        className={`card-value ${type} ${
          saldoNegativo ? "saldo-negativo" : ""
        }`}
      >
        R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </strong>
    </div>
  );
}

