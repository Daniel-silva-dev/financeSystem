export default function Footer() {
  return (
    <footer className="app-footer">
      <p className="footer-text">
        Dúvidas, sugestões ou bugs?
      </p>

      <div className="footer-links">
        <a
          href="https://instagram.com/seu_instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>

        <a
          href="https://wa.me/5599999999999"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>

        <a
          href="https://linkedin.com/in/seu_linkedin"
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
