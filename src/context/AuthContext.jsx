import { useState, useEffect } from 'react';
import { AuthContext } from '../context/auth-context.js';

// (Aquí NO va el 'createContext()')

// 2. Crear el Proveedor
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Efecto para cargar el token desde localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Función para iniciar sesión
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken); 
  };

  // Función para cerrar sesión
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token'); 
  };

  // El "value" es lo que los componentes hijos podrán consumir
  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};