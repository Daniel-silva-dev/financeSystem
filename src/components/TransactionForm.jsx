
import { useState } from "react";

function getTodayLocalDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function TransactionForm({ onSubmit }) {
  const [tipo, setTipo] = useState("entrada");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState(getTodayLocalDate());

  function handleSubmit(e) {
    e.preventDefault();

    if (!descricao || !valor || !categoria || !data) {
      alert("Preencha todos os campos");
      return;
    }

    if (Number(valor) <= 0) {
      alert("Informe um valor maior que zero");
      return;
    }

    onSubmit({
      tipo,
      descricao,
      valor: Number(valor),
      categoria,
      data,
      importante: false,
    });

    setDescricao("");
    setValor("");
    setCategoria("");
    setTipo("entrada");
    setData(getTodayLocalDate());
  }

  return (
    <form
      id="transacoes"
      className="transaction-form"
      onSubmit={handleSubmit}
    >
      <select
        className="form-select"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>

      <input
        className="form-input"
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <input
        className="form-input"
        type="number"
        placeholder="Valor"
        min="0.01"
        step="0.01"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />

      <input
        className="form-input"
        type="text"
        placeholder="Categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />

      <input
        className="form-input"
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <button className="form-button" type="submit">
        Salvar
      </button>
    </form>
  );
}
