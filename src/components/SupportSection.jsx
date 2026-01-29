import { useState } from "react";

export default function SupportSection() {
  const [copied, setCopied] = useState(false);

  const pixKey = "danielsilvadev7@gmail.com";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      alert("Não foi possível copiar a chave PIX.");
      console.log(err);
    }
  }

  return (
    <section className="support-section">
      <h3>💙 Apoie o Projeto</h3>

      <p>
        Este sistema é <strong>100% gratuito</strong> e sempre será.
        Se ele te ajudou e você quiser contribuir para melhorias
        no servidor, IA e novas funcionalidades, você pode apoiar
        o projeto via PIX.
      </p>

      <button className="pix-button" onClick={handleCopy}>
        {copied ? "Chave copiada ✅" : "Fazer PIX"}
      </button>

      <span className="pix-info">
        {copied && "A chave foi copiada para sua área de transferência."}
      </span>
    </section>
  );
}
