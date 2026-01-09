export default function TransactionItem({ transaction, onRemove }) {
  const isEntrada = transaction.tipo === "entrada";

  return (
    <li className="transaction-item">
      <div className="transaction-info">
        <strong className="transaction-desc">
          {transaction.descricao}
        </strong>
        <span className="transaction-category">
          {transaction.categoria}
        </span>
      </div>

      <span
        className={`transaction-value ${
          isEntrada ? "entrada" : "saida"
        }`}
      >
        {isEntrada ? "+" : "-"} R${" "}
        {Number(transaction.valor).toFixed(2)}
      </span>

      <button
        className="transaction-remove"
        onClick={() => onRemove(transaction.id)}
      >
        Excluir
      </button>
    </li>
  );
}
