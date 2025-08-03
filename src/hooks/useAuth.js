import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importamos la librería

const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));

  useEffect(() => {
    // Función para verificar la expiración del token
    const checkTokenExpiration = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // El token ha expirado, cerramos la sesión
            logout();
            alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
            return false;
          }
        } catch (error) {
          // Si el token es inválido, también cerramos la sesión
          logout();
          return false;
        }
      }
      return true;
    };

    // Verificamos el token inmediatamente al cargar el componente
    checkTokenExpiration();

    // Configuramos un intervalo para verificar la expiración cada minuto (o el tiempo que prefieras)
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // 60000 ms = 1 minuto

    // Limpiamos el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
    
  }, []);

  const login = (jwtToken, userRole) => {
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('role', userRole);
    setToken(jwtToken);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  const isAuthenticated = !!token;
  const isAdmin = role === 'admin';

  return { token, isAuthenticated, isAdmin, login, logout };
};

export default useAuth;