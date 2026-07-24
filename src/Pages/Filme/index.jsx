import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import "./filme.css"

function Filme() {
    const { id } = useParams(); //Aqui estamos pegando o ID do filme passado na URL

    const [filme, setFilme] = useState({});
    const [elenco, setElenco] = useState([]);
    const [classificacao, setClassificacao] = useState("L")
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function carregarDetalhes() {
            try{
                setLoading(true);

                //Busca filmes + créditos (elenco) + datas de lançamentos (classificação)
                const response = await api.get(`movie/${id}`, {
                    params: {
                        api_key: import.meta.env.VITE_API_KEY,
                        language: "pt-BR" ,
                        append_to_response: "credits,release_dates",
                    },
                });

                setFilme(response.data);

                //separa os 6 primeiros atores principais do elenco
                if (response.data.credits?.cast) {
                    setElenco(response.data.credits.cast.slice(0,6));
                }

                //Aqui vamos buscar a classificação indicativa de cada filme no BR (BRASIL)
                const releaseBR = response.data.release_dates?.results?.find((item) => item.iso_3166_1 === "BR");
                const cert = releaseBR?.release_dates?.find((r) => r.certification !== "")?.certification;

                setClassificacao(cert || "L");
            } catch(error) {
                console.error("Erro ao buscar detalhes sobre o filme:", error);
                setError(true);
            } finally{
                setLoading(false);
            }
        }

        carregarDetalhes();
    }, [id])

    //Aqui vamos usar a função para auxiliar na formatação na duração (ex: 100mmin para 1H 50min)
    function formatarDuracao(minutos) {
        if (!minutos) return "N/A"
        const h = Math.floor(minutos / 60);
        const m = minutos % 60;
        return `${h}h ${m}m`;
    }

    //Aqui vamos usar a função para auxiliar a formatar data (Ex: 2024-11-27 -> 27/11/2024) 
    function formatarData(data) {
        if (!data) return "N/A"
        return data.split("-").reverse().join("/");
    }

    if (loading) {
        return (
            <div className="filme-carregando">
                <h2>Carregando os detalhes do filme...</h2>
            </div>
        );
    }

    if (error){
        return (
            <div className="filme-erro">
                <h2>Filme não encontrado!</h2>
                <Link to="/">Voltar para Home</Link>
            </div>
        );
    }

    return (
      <div className="detalhes-container">
        <header className="detalhes-header">
          <Link to="/" className="btn-voltar">
            Voltar para Home
          </Link>
          <span className="logo-header">cineRNT</span>
        </header>

        <div
          className="detalhes-banner"
          style={{
            backgroundImage: filme.backdrop_path
              ? `url(https://image.tmdb.org/t/p/original${filme.backdrop_path})`
              : "none",
          }}
        >
          <div className="banner-overlay"></div>
        </div>

        <main className="detalhes-conteudo">
          <div className="poster-container">
            <img
              src={
                filme.poster_path
                  ? `https://image.tmdb.org/t/p/original/${filme.poster_path}`
                  : "https://via.placeholder.com/500x750?text=Sem+Foto"
              }
              alt={filme.title}
            />
          </div>

          <div className="info-container">
            <h2>{filme.title}</h2>

            <div className="metadados">
              <span className="classificacao-badge">{classificacao}</span>
              <span>{formatarData(filme.release_date)}</span>
              <span>{formatarDuracao(filme.runtime)}</span>
            </div>

            <div className="sinopse-box">
              <h3>Sinopse</h3>
              <p>{filme.overview || "Sinopse não disponível em português."}</p>
            </div>

            {elenco.length > 0 && (
              <div className="elenco-box">
                <h3>Elenco principal</h3>
                <div className="elenco-grid">
                  {elenco.map((ator) => (
                    <div key={ator.id} className="ator-card">
                      <img
                        src={
                          ator.profile_path
                            ? `https://image.tmdb.org/t/p/w185${ator.profile_path}`
                            : "https://via.placeholder.com/185x278?text=Sem+Foto"
                        }
                        alt={ator.name}
                      />
                      <strong>{ator.name}</strong>
                      <span>{ator.character}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
}

export default Filme;