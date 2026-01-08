export default function MonthSelector({ month, setMonth }) {
  function changeMonth(offset) {
    const [year, mon] = month.split("-").map(Number);
    const date = new Date(year, mon - 1 + offset);

    setMonth(date.toISOString().slice(0, 7));
  }

  return (
    <div>
      <button onClick={() => changeMonth(-1)}>◀</button>

      <strong>
        {new Date(month + "-01").toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric"
        })}
      </strong>

      <button onClick={() => changeMonth(1)}>▶</button>
    </div>
  );
}
