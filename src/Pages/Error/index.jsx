import { Link } from "react-router-dom";
import "./erro.css";

function Error() {
  return (
    <div className="erro">
      <h1>404</h1>
      <h2>Página não encontrada! 🎬</h2>
      <p>Parece que o filme ou a página que você procura não está em cartaz.</p>
      <Link to="/">Veja todos os filmes em cartaz</Link>
    </div>
  );
}

export default Error;