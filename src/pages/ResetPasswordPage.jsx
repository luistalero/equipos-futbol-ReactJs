import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/auth'; // Necesitas crear esta función en tu API de autenticación
import Header from '../components/Header';
import ActionButton from '../components/ActionButton';

const ResetPasswordPage = () => {
  const { token } = useParams(); // Asume que la URL es /reset-password/:token
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    try {
      await resetPassword(token, password);
      setMessage('Contraseña restablecida exitosamente. Serás redirigido al inicio de sesión.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError('El enlace de restablecimiento es inválido o ha expirado.', err);
    }
  };

  return (
    <div className="page-wrapper">
      <Header title="Restablecer Contraseña" />
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Nueva Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <ActionButton type="submit" label="Restablecer Contraseña" />
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;