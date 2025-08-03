import React from 'react';
import '../styles/components/actionbutton.css';

const ActionButton = ({ label, onClick, color = 'primary' }) => {
  return (
    <button className={`action-button ${color}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default ActionButton;