export default function TransactionItem({
  transaction,
  onRemove,
  onToggleImportante
}) {
  const isEntrada = transaction.tipo === "entrada";

  return (
    <li
      className={`transaction-item ${
        transaction.importante ? "importante" : ""
      }`}
    >
      <div className="transaction-info">
        <strong>{transaction.descricao}</strong>
        <span>{transaction.categoria}</span>
      </div>

      <span
        className={`transaction-value ${
          isEntrada ? "entrada" : "saida"
        }`}
      >
        {isEntrada ? "+" : "-"} R$ {transaction.valor.toFixed(2)}
      </span>

      <div className="transaction-actions">
        <button
          className={`important-btn ${
            transaction.importante ? "active" : ""
          }`}
          onClick={() => onToggleImportante(transaction.id)}
          title="Marcar como importante"
        >
          ★
        </button>
        <button
          className="transaction-remove"
          onClick={() => {
            const confirmDelete = window.confirm(
              "Tem certeza que deseja excluir esta transação?"
            );

            if (confirmDelete) {
              onRemove(transaction.id);
            }
          }}
        >
          Excluir
        </button>

      </div>
    </li>
  );
}

