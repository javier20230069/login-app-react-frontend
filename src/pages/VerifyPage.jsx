import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import './forms.css'; // Reutilizamos los mismos estilos

const VerifyPage = () => {
  const [codigo, setCodigo] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Hook para leer los datos pasados

  // Leemos el email que la página de Registro nos pasó
  const correo = location.state?.email;

  // Si no hay email (ej. recargan la página), redirigimos
  if (!correo) {
    navigate('/register');
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/verify', { correo, codigo });

      alert('¡Cuenta verificada! Ahora puedes iniciar sesión.');
      navigate('/login');

    } catch (error) {
      console.error(error.response.data);
      alert(error.response.data.msg || 'El código es incorrecto o ha expirado.');
    }
  };

  return (
    <div className="form-container">
      <h2>Verifica tu Cuenta</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px' }}>
        Enviamos un código de 6 dígitos a: <br /> <strong>{correo}</strong>
      </p>
      <form className="auth-form" onSubmit={onSubmit}>
        <input
          type="text"
          name="codigo"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Ingresa el código"
          className="auth-input"
          required
        />
        <button type="submit" className="auth-button">
          Verificar
        </button>
      </form>

      {/* --- ENLACE AÑADIDO --- */}
      <p className="form-switch-link">
        ¿Recordaste tu contraseña? <Link to="/login">Inicia Sesión</Link>
      </p>
    </div>
  );
};

export default VerifyPage;