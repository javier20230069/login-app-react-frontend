import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './forms.css'; // Reutilizamos los estilos

const ForgotPasswordPage = () => {
  const [correo, setCorreo] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/forgot-password', { correo: correo.toLowerCase() });
      const { preguntaSecreta } = res.data;

      navigate('/reset-password', { state: { correo, preguntaSecreta } });

    } catch (error) {
      console.error(error.response.data);
      alert(error.response.data.msg || 'No se pudo encontrar el usuario.');
    }
  };

  return (
    <div className="form-container">
      <h2>Recuperar Contraseña</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>
        Ingresa tu correo para buscar tu cuenta.
      </p>
      <form className="auth-form" onSubmit={onSubmit}>
        <input
          type="email"
          name="correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="Correo Electrónico"
          className="auth-input"
          required
        />
        <button type="submit" className="auth-button">
          Buscar
        </button>
      </form>

      {/* --- ENLACE AÑADIDO --- */}
      <p className="form-switch-link">
        ¿Recordaste tu contraseña? <Link to="/login">Inicia Sesión</Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;