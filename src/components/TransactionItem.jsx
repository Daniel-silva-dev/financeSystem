
import { useState } from "react";

function formatDate(date) {
  if (!date) return "Data não informada";

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export default function TransactionItem({
  transaction,
  onRemove,
  onToggleImportante,
  onEdit,
}) {
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    tipo: transaction.tipo,
    descricao: transaction.descricao,
    categoria: transaction.categoria,
    valor: transaction.valor,
    data: transaction.data || "",
  });

  const isEntrada = transaction.tipo === "entrada";

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSave(e) {
    e.preventDefault();

    if (
      !form.descricao.trim() ||
      !form.categoria.trim() ||
      !form.valor ||
      !form.data
    ) {
      alert("Preencha todos os campos");
      return;
    }

    if (Number(form.valor) <= 0) {
      alert("Informe um valor maior que zero");
      return;
    }

    onEdit(transaction.id, {
      ...form,
      valor: Number(form.valor),
    });

    setEditing(false);
  }

  function handleCancel() {
    setForm({
      tipo: transaction.tipo,
      descricao: transaction.descricao,
      categoria: transaction.categoria,
      valor: transaction.valor,
      data: transaction.data || "",
    });

    setEditing(false);
  }

  return (
    <li
      className={`transaction-item ${
        transaction.importante ? "importante" : ""
      }`}
    >
      {editing ? (
        <form className="transaction-edit-form" onSubmit={handleSave}>
          <select
            name="tipo"
            className="form-select"
            value={form.tipo}
            onChange={handleChange}
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>

          <input
            className="form-input"
            type="text"
            name="descricao"
            placeholder="Descrição"
            value={form.descricao}
            onChange={handleChange}
          />

          <input
            className="form-input"
            type="text"
            name="categoria"
            placeholder="Categoria"
            value={form.categoria}
            onChange={handleChange}
          />

          <input
            className="form-input"
            type="number"
            name="valor"
            min="0.01"
            step="0.01"
            placeholder="Valor"
            value={form.valor}
            onChange={handleChange}
          />


          <div className="transaction-actions">
            <button className="form-button" type="submit">
              Salvar
            </button>

            <button
              className="transaction-remove"
              type="button"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="transaction-info">
            <strong>{transaction.descricao}</strong>
            <span>{transaction.categoria}</span>
            <small>{formatDate(transaction.data)}</small>
          </div>

          <span
            className={`transaction-value ${
              isEntrada ? "entrada" : "saida"
            }`}
          >
            {isEntrada ? "+" : "-"} R${" "}
            {Number(transaction.valor).toFixed(2)}
          </span>

          <div className="transaction-actions">
            <button
              className={`important-btn ${
                transaction.importante ? "active" : ""
              }`}
              onClick={() => onToggleImportante(transaction.id)}
              title="Marcar como importante"
              type="button"
            >
              ★
            </button>

            <button
              className="transaction-remove"
              type="button"
              onClick={() => setEditing(true)}
            >
              Editar
            </button>

            <button
              className="transaction-remove"
              type="button"
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
        </>
      )}
    </li>
  );
}
