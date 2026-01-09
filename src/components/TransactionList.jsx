import TransactionItem from "./TransactionItem";

export default function TransactionList({ transactions, onRemove }) {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhuma transação cadastrada</p>
        <span>Adicione uma entrada ou saída acima</span>
      </div>
    );
  }

  return (
    <ul className="transaction-list">
      {transactions.map(transaction => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
