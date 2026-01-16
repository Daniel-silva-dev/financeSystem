export default function Header() {
  function scrollToSection(id) {
    const element = document.getElementById(id);
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-logo">FinanceSystem</h1>

        <nav className="header-nav">
          <button onClick={() => scrollToSection("dashboard")}>
            Dashboard
          </button>
          <button onClick={() => scrollToSection("transacoes")}>
            Transações
          </button>
          <button onClick={() => scrollToSection("resumo")}>
            Resumo IA
          </button>
        </nav>
      </div>
    </header>
  );
}
