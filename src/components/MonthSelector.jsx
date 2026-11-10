
export default function MonthSelector({ month, setMonth }) {
  function changeMonth(offset) {
    const [year, mon] = month.split("-").map(Number);

    const date = new Date(year, mon - 1 + offset, 1);

    const newMonth = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
    ].join("-");

    setMonth(newMonth);
  }

  const formattedMonth = new Date(`${month}-01T12:00:00`).toLocaleDateString(
    "pt-BR",
    {
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="month-selector">
      <button
        type="button"
        className="month-button"
        onClick={() => changeMonth(-1)}
        aria-label="Mês anterior"
      >
        ◀
      </button>

      <strong className="month-label">
        {formattedMonth}
      </strong>

      <button
        type="button"
        className="month-button"
        onClick={() => changeMonth(1)}
        aria-label="Próximo mês"
      >
        ▶
      </button>
    </div>
  );
}
