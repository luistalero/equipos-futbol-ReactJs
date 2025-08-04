import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import '../styles/components/header.css';

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  }, [theme]);

  return (
    <div className="header-container">
      <h1 className="header-title">{title}</h1>
      <button onClick={handleHomeClick} className="header-home-button">
        Inicio
      </button>
      <button onClick={toggleTheme}>
        Cambiar a {theme === 'light' ? 'Oscuro' : 'Claro'}
      </button>
    </div>
  );
};

export default Header;