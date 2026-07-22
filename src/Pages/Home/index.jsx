import { useState, useEffect } from "react";
import api from '../../services/api';
import './home.css';

function Home() {
    const [filme, setFilme] = useState([]);
    const [loading, setLoading] = useState (true);
    const [error, setError] = useState(null);

    //useEffect dispara a busca assim que o componente carrega a tela
    useEffect(() => {
        async function carregarFilmes() {
            try{
                setLoading(true);

                //buscando os filmes em exibição no idioma pt-BR
                const response = await api.get('movie/now_playing', {
                    params:{
                        api_key: import.meta.env.VITE_API_KEY, //pega a API dentro do .env
                        language: 'pt-BR',
                        page: 1,
                    }
                })

                //Guardamos o array de filme no nosso estado
                setFilme(response.data.results);
            }catch(error) {
                console.error("Erro ao buscar o filme", error);
                setError("Não foi possível carregar os filmes. Tente novamente mais tarde")
            } finally {
                // Finaliza o estado do carregamento com sucesso ou erro.
                setLoading(false);
            }
        }

        carregarFilmes();
    }, []) //Array de dependências vazio = roda apenas 1 vez ao carregar a página

    // Renderização condicional para tratar os estados 
    if (loading) {
        return(
            <div className="carregando-filmes">
                <h2>Carregando os filmes... </h2>
            </div>
        );
    }

    if(error) {
        return(
            <div className="mensagem-erro">
                <h2>{error}</h2>
            </div>
        );
    }

    return(
        <div className="home-container">
            <section className="hero-section">
                <div className="hero-overlay">
                    <div className="search-box">
                        <input type="text" placeholder="Buscar por um filme..." />
                        <button type="button">Buscar</button>
                    </div>
                </div>
            </section>

            <nav className="navegacao">
                <button className="nav-item-ativado">Home</button>
                <button className="nav-item">Filmes</button>
            </nav>

            <main className="secao-principal">
                <h2>Filmes em Cartaz</h2>
                <div className="lista-filmes">
                    {filme.map((filme) => (
                        <article key={filme.id} className="filme-card">
                            <img className="poster"
                                src={`https://image.tmdb.org/t500/${filme.poster_path}`}
                                alt={filme.title}
                            />
                        </article>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Home;