import React, { useState } from 'react';
import { forgotPassword } from '../api/auth'; // Necesitas crear esta función en tu API de autenticación
import Header from '../components/Header';
import ActionButton from '../components/ActionButton';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await forgotPassword(email);
      setMessage('Si el correo electrónico existe, se ha enviado un enlace para restablecer la contraseña.');
    } catch (err) {
      setError('Ocurrió un error al procesar la solicitud.', err);
    }
  };

  return (
    <div className="page-wrapper">
      <Header title="¿Olvidaste tu Contraseña?" />
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <ActionButton type="submit" label="Enviar enlace de recuperación" />
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;