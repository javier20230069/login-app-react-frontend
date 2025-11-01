import axios from 'axios';

// ¡INGRESA AQUÍ EL URL REAL DE TU BACKEND EN VERCEL!
// DEBE VERSE ASÍ: 'https://nombre-de-tu-api.vercel.app/api'
const API_BASE_URL = 'https://TU-API-DE-VERCEL.vercel.app/api'; 

const api = axios.create({
  baseURL: API_BASE_URL
});

export default api;
