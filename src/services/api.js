//SRC/SERVICES/API.JS
import axios from 'axios';

// URL base da API do TMDB 
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3'
});

export default api;