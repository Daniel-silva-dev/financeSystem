import TransactionItem from "./TransactionItem";

export default function TransactionList({ transactions, onRemove }) {
  if (transactions.length === 0) {
    return <p>Nenhuma transação cadastrada.</p>;
  }

  return (
    <ul>
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
