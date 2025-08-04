import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import NavLinkButton from '../components/NavLinkButton';
import '../styles/pages/homepage.css';

const HomePage = () => {
  const { isAuthenticated, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <h1>Bienvenido a la aplicación</h1>
      {isAuthenticated ? (
        <div className="button-grid-home">
          <p>Has iniciado sesión. ¡Aquí puedes gestionar la información!</p>
          <NavLinkButton to="/teams" label="Equipos" />
          <NavLinkButton to="/players" label="Jugadores" />
          <NavLinkButton to="/positions" label="Posiciones" />
          <NavLinkButton to="/technical-directory" label="Directores Técnicos" />
          {isAdmin && (
            <NavLinkButton to="/users" label="Usuarios" />
          )}
          <button className='btn-logout' onClick={logout}>Cerrar Sesión</button>
        </div>
      ) : (
        <>
          <p>Por favor, inicia sesión para ver el contenido.</p>
          <button onClick={handleLoginClick}>Iniciar Sesión</button>
        </>
      )}
    </div>
  );
};

export default HomePage;