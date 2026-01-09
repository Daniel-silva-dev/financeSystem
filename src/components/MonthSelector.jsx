export default function MonthSelector({ month, setMonth }) {
  function changeMonth(offset) {
    const [year, mon] = month.split("-").map(Number);
    const date = new Date(year, mon - 1 + offset);

    setMonth(date.toISOString().slice(0, 7));
  }

  return (
    <div className="month-selector">
      <button
        className="month-button"
        onClick={() => changeMonth(-1)}
        aria-label="Mês anterior"
      >
        ◀
      </button>

      <strong className="month-label">
        {new Date(month + "-01").toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric"
        })}
      </strong>

      <button
        className="month-button"
        onClick={() => changeMonth(1)}
        aria-label="Próximo mês"
      >
        ▶
      </button>
    </div>
  );
}
