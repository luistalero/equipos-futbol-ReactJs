import React, { createContext, useState, useEffect } from 'react';

// Se crea el contexto. Por defecto no tiene valor.
export const ThemeContext = createContext();

// Este es el componente que "provee" el tema a toda la aplicación.
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};