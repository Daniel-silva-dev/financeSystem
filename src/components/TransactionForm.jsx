import { useState } from "react";

export default function TransactionForm({ onSubmit }) {
  function getTodayLocalDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 2).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

  const [tipo, setTipo] = useState("entrada");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!descricao || !valor || !categoria ) {
      alert("Preencha todos os campos");
      return;
    }

    onSubmit({
      tipo,
      descricao,
      valor: Number(valor),
      categoria,
      data: getTodayLocalDate()
    });


    // limpar form
    setDescricao("");
    setValor("");
    setCategoria("");
    setTipo("entrada");
  }

  return (
    <form onSubmit={handleSubmit}>
      <select value={tipo} onChange={e => setTipo(e.target.value)}>
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>

      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={e => setDescricao(e.target.value)}
      />

      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={e => setValor(e.target.value)}
      />

      <input
        type="text"
        placeholder="Categoria"
        value={categoria}
        onChange={e => setCategoria(e.target.value)}
      />

      <button type="submit">Salvar</button>
    </form>
  );
}
