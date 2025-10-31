import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import VerifyPage from './pages/VerifyPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';

import { useAuth } from './hooks/useAuth.jsx'; 
import './pages/forms.css'; // Importar estilos globales

// Componente para decodificar el JWT y obtener el nombre del usuario
const DashboardPage = () => {
  const { token, logout } = useAuth(); 
  const navigate = useNavigate();

  // Redirigir si no hay token (protección de ruta básica)
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Decodificar el token para mostrar el nombre
  const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const userName = decodedToken?.user?.nombre || decodedToken?.user?.email || 'Usuario'; // Intenta obtener el nombre o email

  return (
    <div className="form-container" style={{ minHeight: '80vh', padding: '50px', maxWidth: '600px', display: 'block' }}>
      <h2 style={{ color: '#007bff' }}>¡Bienvenido, {userName}!</h2>
      <p style={{ marginBottom: '30px', color: '#555' }}>Has iniciado sesión con éxito.</p>

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
        <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '15px' }}>Información de Sesión (JWT)</h3>
        <p style={{ wordBreak: 'break-all', fontSize: '0.9em' }}>
          <strong>Token (Parcial):</strong> {token ? token.substring(0, 40) + '...' : 'Cargando...'}
        </p>
        <p style={{ marginTop: '10px' }}>
          <strong>ID de Usuario:</strong> {decodedToken?.user?.id || 'N/A'}
        </p>
      </div>

      <button 
        onClick={logout} 
        className="auth-button" 
        style={{ marginTop: '30px', backgroundColor: '#dc3545' }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};


function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth(); 

  // Lógica para leer el token después del login de Google (OAuth)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const googleToken = params.get('token');

    if (googleToken) {
      // Si encontramos el token en la URL, lo guardamos y limpiamos la URL
      login(googleToken);
      navigate('/dashboard', { replace: true });
    }
  }, [location.search, login, navigate]); 

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Dashboard (Página Protegida) */}
      <Route path="/dashboard" element={<DashboardPage />} />
      
      {/* Redirige la ruta raíz a la página de registro */}
      <Route path="/" element={<RegisterPage />} /> 
    </Routes>
  );
}

export default App;
