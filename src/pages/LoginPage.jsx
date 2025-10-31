import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth.jsx';
import './forms.css';

// SVG Icon for Google (to avoid external libraries)
const GoogleIcon = () => (
  <svg className="google-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M45.1 20H24v8.5h11.8C34.7 33.9 30 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 3.1l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11.1 0 20.3-8 21.6-18H45.1z" />
    <path fill="#34A853" d="M24 46c5.5 0 10.7-1.9 14.2-5.3l-6.4-6.4C30 35.9 27.1 37 24 37c-5.9 0-11-3.1-13.4-7.7h-6.8C4.1 34.6 11.8 46 24 46z" />
    <path fill="#FBBC04" d="M10.6 29.3c-1.1-3.2-1.1-6.6 0-9.8H3.8C2.5 21.7 2 24.8 2 28s.5 6.3 1.8 9.8h6.8z" />
    <path fill="#EA4335" d="M24 11c3.1 0 5.8 1.1 8.1 3.1l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24c0 2.2.3 4.3.8 6.3h6.8C7.6 27.2 7 24.6 7 22.3z" />
  </svg>
);


const LoginPage = () => {
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { correo, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert email to lowercase before sending (to match DB storage)
      const res = await api.post('/auth/login', { ...formData, correo: formData.correo.toLowerCase() });
      
      const token = res.data.token;
      login(token); 
      
      alert('¡Inicio de sesión exitoso!');
      navigate('/dashboard'); 

    } catch (error) {
      console.error(error.response.data);
      alert(error.response.data.msg); 
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      
      {/* --- Google OAuth Button --- */}
      <a 
        // Direct link to the backend's Google OAuth initiation endpoint
        href="http://localhost:5000/api/auth/google" 
        className="google-button"
      >
        <GoogleIcon />
        Continuar con Google
      </a>

      <div className="auth-separator">o</div>
      
      <form className="auth-form" onSubmit={onSubmit}>
        <input
          type="email"
          name="correo"
          value={correo}
          onChange={onChange}
          placeholder="Correo Electrónico"
          className="auth-input"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Contraseña"
          className="auth-input"
          required
        />
        <button type="submit" className="auth-button green">
          Entrar
        </button>

        {/* Link for password recovery */}
        <p className="form-switch-link" style={{ textAlign: 'right', marginTop: '10px', fontSize: '0.9em' }}>
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </p>
      </form>
      
      <p className="form-switch-link">
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  );
};

export default LoginPage;
