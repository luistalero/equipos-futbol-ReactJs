import React from 'react';
import { Navigate } from 'react-router-dom';
import NavLinkButton from '../components/NavLinkButton';
import '../styles/pages/homepage.css';
import useAuth from '../hooks/useAuth';

const HomePage = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();

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
          <Navigate to="/login" />
        </>
      )}
    </div>
  );
};

export default HomePage;