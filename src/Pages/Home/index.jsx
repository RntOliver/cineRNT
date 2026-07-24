import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import api from "../../services/api";
import "./home.css";

function Home() {
  const [filme, setFilme] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para controlar o índice do filme atual dentro do carrosel
  const [slideAtual, setSlideAtual] = useState(0);

  async function carregarFilmes() {
    try {
      setLoading(true);
      const response = await api.get("movie/now_playing", {
        params: {
          api_key: import.meta.env.VITE_API_KEY,
          language: "pt-BR",
          page: 1,
        },
      });
      setFilme(response.data.results);
    } catch (error) {
      console.error("Erro ao buscar o filme", error);
      setError(
        "Não foi possível carregar os filmes. Tente novamente mais tarde",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarFilmes();
  }, []);

  useEffect(() => {
    if (filme.length === 0) return;

    const limiteCarrosel = Math.min(filme.length, 5);

    const timer = setInterval(() => {
      setSlideAtual((prevSlide) => (prevSlide + 1) % limiteCarrosel);
    }, 5000);

    return () => clearInterval(timer);
  }, [filme]);

  async function handleSearch(e) {
    e.preventDefault();

    if (!busca.trim()) {
      carregarFilmes();
      return;
    }

    try {
      setLoading(true);
      const response = await api.get("search/movie", {
        params: {
          api_key: import.meta.env.VITE_API_KEY,
          query: busca,
          language: "pt-BR",
        },
      });

      setFilme(response.data.results);
      setSlideAtual(0);
    } catch (error) {
      console.error("Erro na busca por filmes", error);
      setError("Erro ao pesquisar filmes.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="carregando-filmes">
        <h2>Carregando os filmes... </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mensagem-erro">
        <h2>{error}</h2>
      </div>
    );
  }

  // Pegamos no máximo 5 filmes para o carrosel do Header
  const filmesCarrossel = filme.slice(0, 5);

  return (
    <div className="hero-container">
      <section className="hero-section">
        {filmesCarrossel.map((item, index) => (
          <div
            key={item.id}
            className={`hero-slide ${index === slideAtual ? "ativo" : ""}`}
            style={{
              backgroundImage: item.backdrop_path
                ? `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`
                : "none",
            }}
          />
        ))}

        <div className="hero-overlay">
          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar por um filme..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button type="submit">Buscar</button>
          </form>

          {filmesCarrossel.length > 1 && (
            <div className="carrosel-indicadores">
              {filmesCarrossel.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`ponto-indicador ${index === slideAtual ? "ativo" : ""}`}
                  onClick={() => setSlideAtual(index)}
                ></button>
              ))}
            </div>
          )}
        </div>
      </section>

      <nav className="navegacao">
        <button className="nav-item-ativado" onClick={carregarFilmes}>
          Home
        </button>
        <button className="nav-item">Filmes</button>
      </nav>

      <main className="secao-principal">
        <h2>{busca ? `resultado para: "${busca}"` : "Filmes em Cartaz"}</h2>

        {filme.length === 0 ? (
          <p className="sem-resultado">
            Nenhum filme encontrado com esse nome.
          </p>
        ) : (
          <div className="lista-filmes">
            {filme.map((filme) => (
              <article key={filme.id} className="filme-card">
                <Link to={`/filme/${filme.id}`}>
                  <img
                    className="poster"
                    src={
                      filme.poster_path
                        ? `https://image.tmdb.org/t/p/original/${filme.poster_path}`
                        : "https://via.placeholder.com/500x750?text=Sem+Foto"
                    }
                    alt={filme.title}
                  />
                  <strong className="titulo-filme">{filme.title}</strong>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
