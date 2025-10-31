import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import './forms.css';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { correo, preguntaSecreta } = location.state || {};
  const [mode, setMode] = useState('pregunta');
  const [respuestaSecreta, setRespuestaSecreta] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');

  if (!correo) {
    navigate('/forgot-password');
  }

  const handleSendCode = async () => {
    try {
      await api.post('/auth/send-reset-code', { correo });
      setMode('codigo'); 
      alert('Código de recuperación enviado a tu email.');
    } catch (error) {
      console.error('Error al enviar el código:', error);
      alert('Error al enviar el código.');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'pregunta') {
        await api.post('/auth/verify-answer', { 
          correo, 
          respuestaSecreta, 
          nuevaPassword 
        });
      } else {
        await api.post('/auth/reset-with-code', {
          correo,
          codigo,
          nuevaPassword
        });
      }
      alert('¡Contraseña actualizada con éxito!');
      navigate('/login');
    } catch (error) {
      console.error(error.response.data);
      alert(error.response.data.msg || 'Error al actualizar la contraseña.');
    }
  };

  return (
    <div className="form-container">
      <h2>Restablecer Contraseña</h2>
      <p style={{ marginBottom: '20px', color: '#555' }}>
        Responde tu pregunta secreta o pide un código a tu email.
      </p>

      {mode === 'pregunta' && (
        <form className="auth-form" onSubmit={onSubmit}>
          <label style={{ fontSize: '0.9em', color: '#555' }}>Tu pregunta secreta:</label>
          <strong style={{ marginBottom: '10px' }}>{preguntaSecreta}</strong>
          
          <input
            type="text"
            name="respuestaSecreta"
            value={respuestaSecreta}
            onChange={(e) => setRespuestaSecreta(e.target.value)}
            placeholder="Tu respuesta secreta"
            className="auth-input"
            required
          />
          <input
            type="password"
            name="nuevaPassword"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            placeholder="Nueva Contraseña"
            className="auth-input"
            required
          />
          <button type="submit" className="auth-button">
            Actualizar Contraseña
          </button>
          
          <button 
            type="button" 
            onClick={handleSendCode} 
            className="auth-button"
            style={{ backgroundColor: '#6c757d', marginTop: '10px' }}
          >
            Usar código de Email
          </button>
        </form>
      )}

      {mode === 'codigo' && (
        <form className="auth-form" onSubmit={onSubmit}>
          <p>Revisa tu email por un código de 6 dígitos.</p>
          <input
            type="text"
            name="codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código de 6 dígitos"
            className="auth-input"
            required
          />
          <input
            type="password"
            name="nuevaPassword"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            placeholder="Nueva Contraseña"
            className="auth-input"
            required
          />
          <button type="submit" className="auth-button">
            Actualizar Contraseña
          </button>
          <button 
            type="button" 
            onClick={() => setMode('pregunta')} 
            className="auth-button"
            style={{ backgroundColor: '#6c757d', marginTop: '10px' }}
          >
            Volver a la pregunta
          </button>
        </form>
      )}

      {/* --- ENLACE AÑADIDO --- */}
      <p className="form-switch-link">
        ¿Recordaste tu contraseña? <Link to="/login">Inicia Sesión</Link>
      </p>
    </div>
  );
};

export default ResetPasswordPage;