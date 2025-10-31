import axios from 'axios';

// Creamos una instancia de axios pre-configurada
const api = axios.create({
  // Esta es la URL de tu backend
  baseURL: 'http://localhost:5000/api' 
});

/*
  (Más adelante, aquí también pondremos la lógica para
  adjuntar el token de autenticación a todas las peticiones)
*/

export default api;