import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/header.css';

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="header-container">
      <h1 className="header-title">{title}</h1>
      <button onClick={handleHomeClick} className="header-home-button">
        Inicio
      </button>
    </div>
  );
};

export default Header;