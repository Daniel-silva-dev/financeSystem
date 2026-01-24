export default function Footer() {
  return (
    <footer className="app-footer">
      <p className="footer-text">
        Dúvidas, sugestões ou bugs?
      </p>

      <div className="footer-links">
        <a
          href="mailto:danielsilvadev7@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          E-mail
        </a>

        <a
          href="https://wa.me/55084992035664"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>

        <a
          href="https://www.linkedin.com/in/danieldev5g/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>

      <span className="footer-copy">
        © {new Date().getFullYear()} FinanceSystem
      </span>
    </footer>
  );
}
