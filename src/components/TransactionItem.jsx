export default function TransactionItem({ transaction, onRemove }) {
  const isEntrada = transaction.tipo === "entrada";

  return (
    <li
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "8px"
      }}
    >
      <span>
        {transaction.descricao} — {transaction.categoria}
      </span>

      <span style={{ color: isEntrada ? "green" : "red" }}>
        {isEntrada ? "+" : "-"} R${" "}
        {Number(transaction.valor).toFixed(2)}
      </span>

      <button onClick={() => onRemove(transaction.id)}>Excluir</button>
    </li>
  );
}
