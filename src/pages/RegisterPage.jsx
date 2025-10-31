import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
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


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    password: '',
    preguntaSecreta: '¿Nombre de tu primera mascota?', // Default value
    respuestaSecreta: '',
  });

  const [errors, setErrors] = useState({}); // Nuevo estado para los errores de validación
  
  const navigate = useNavigate();
  const { nombre, correo, telefono, password, preguntaSecreta, respuestaSecreta } = formData;

  const onChange = (e) => {
    // Limpiar el error del campo al escribir
    setErrors({ ...errors, [e.target.name]: null });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función de validación de todos los campos
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    
    // 1. Validación de Correo
    if (!emailRegex.test(correo)) {
      newErrors.correo = 'El formato del correo electrónico no es válido.';
    }

    // 2. Validación de Teléfono
    if (!phoneRegex.test(telefono)) {
      newErrors.telefono = 'El teléfono debe contener exactamente 10 dígitos numéricos.';
    }

    // 3. Validación de Contraseña (Mínimo 8, Mayúscula, Número, Símbolo)
    const passwordRequirements = {
      min: 8,
      upper: /[A-Z]/,
      number: /[0-9]/,
      special: /[!@#$%^&*()_+]/
    };

    if (password.length < passwordRequirements.min) {
      newErrors.password = 'Mínimo 8 caracteres.';
    } else if (!passwordRequirements.upper.test(password)) {
      newErrors.password = 'Debe incluir al menos una mayúscula.';
    } else if (!passwordRequirements.number.test(password)) {
      newErrors.password = 'Debe incluir al menos un número.';
    } else if (!passwordRequirements.special.test(password)) {
      newErrors.password = 'Debe incluir al menos un carácter especial (!@#$...).';
    }

    // 4. Otras validaciones (para completar los campos requeridos en el cliente)
    if (!nombre) newErrors.nombre = 'El nombre es obligatorio.';
    if (!respuestaSecreta) newErrors.respuestaSecreta = 'La respuesta secreta es obligatoria.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };


  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        // Si la validación falla, detenemos el envío
        alert('Por favor, corrige los errores en el formulario.');
        return; 
    }

    try {
      // Envío a la API
      await api.post('/auth/register', { ...formData, correo: formData.correo.toLowerCase() });
      
      alert('¡Registro exitoso! Te hemos enviado un código a tu correo.');
      
      navigate('/verify', { state: { email: formData.correo } });

    } catch (error) {
      console.error(error.response.data);
      alert(error.response.data.msg);
    }
  };

  return (
    <div className="form-container">
      <h2>Crear Cuenta</h2>
      
      {/* --- Google OAuth Button --- */}
      <a 
        href="http://localhost:5000/api/auth/google" 
        className="google-button"
      >
        <GoogleIcon />
        Continuar con Google
      </a>

      <div className="auth-separator">o</div>

      <form className="auth-form" onSubmit={onSubmit}>
        <input
          type="text"
          name="nombre"
          value={nombre}
          onChange={onChange}
          placeholder="Nombre Completo"
          className={`auth-input ${errors.nombre ? 'input-error' : ''}`}
          required
        />
        {errors.nombre && <p className="error-message">{errors.nombre}</p>}

        <input
          type="email"
          name="correo"
          value={correo}
          onChange={onChange}
          placeholder="Correo Electrónico"
          className={`auth-input ${errors.correo ? 'input-error' : ''}`}
          required
        />
        {errors.correo && <p className="error-message">{errors.correo}</p>}

        <input
          type="tel"
          name="telefono"
          value={telefono}
          onChange={onChange}
          placeholder="Teléfono (10 dígitos)"
          // Añadimos un pattern para la validación nativa (ayuda con la UX)
          pattern="\d{10}"
          maxLength="10"
          className={`auth-input ${errors.telefono ? 'input-error' : ''}`}
        />
        {errors.telefono && <p className="error-message">{errors.telefono}</p>}

        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Contraseña (Min. 8, Mayús, Num, Símb)"
          className={`auth-input ${errors.password ? 'input-error' : ''}`}
          required
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
        
        <label style={{ fontSize: '0.9em', color: '#555', marginBottom: '-5px', marginTop: '10px' }}>Pregunta Secreta:</label>
        <select 
          name="preguntaSecreta" 
          value={preguntaSecreta} 
          onChange={onChange} 
          className="auth-input"
        >
          <option value="¿Nombre de tu primera mascota?">¿Nombre de tu primera mascota?</option>
          <option value="¿Cuál es tu comida favorita?">¿Cuál es tu comida favorita?</option>
          <option value="¿Ciudad donde naciste?">¿Ciudad donde naciste?</option>
        </select>

        <input
          type="text"
          name="respuestaSecreta"
          value={respuestaSecreta}
          onChange={onChange}
          placeholder="Respuesta secreta"
          className={`auth-input ${errors.respuestaSecreta ? 'input-error' : ''}`}
          required
        />
        {errors.respuestaSecreta && <p className="error-message">{errors.respuestaSecreta}</p>}


        <button type="submit" className="auth-button">
          Registrarse
        </button>
      </form>
      <p className="form-switch-link">
        ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
