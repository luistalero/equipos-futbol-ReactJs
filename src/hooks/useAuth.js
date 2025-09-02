import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));

  const API_URL = import.meta.env.VITE_API_URL;
  const VITE_WS_URL = import.meta.env.VITE_WS_URL;

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
          
          logout();
          return false;
        }
      }
      return true;
    };

    const checkUserSuspension = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken);
          const userId = decodedToken.id;
          const response = await axios.get(`${API_URL}/users/${userId}/status`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (response.data.is_suspended) {
            logout();
            alert('Tu cuenta ha sido suspendida. Contacta con el soporte para más información.');
          }

        } catch (error) {
          if (error.response && error.response.status === 403) {
            logout();
            alert('Tu sesión ha sido invalidada. Por favor, inicia sesión de nuevo.');
          }
          console.error('Error al verificar el estado de suspensión:', error);
        }
      }
    };

    checkTokenExpiration();

    const ws = new WebSocket(VITE_WS_URL);

    ws.onopen = () => {
      console.log('Conexión WebSocket establecida para notificaciones de suspensión.');
      if (token) {
        ws.send(JSON.stringify({ type: 'auth', token }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'user-status' && message.status === 'suspended') {
            console.log('Tu cuenta ha sido suspendida. Cerrando sesión...');
            logout();
        }
      } catch (error) {
        console.error('Error al procesar el mensaje del WebSocket:', error);
      }
    };

    ws.onclose = () => {
      console.log('Conexión WebSocket cerrada.');
    };

    ws.onerror = (error) => {
      console.error('Error en el WebSocket:', error);
    };

    return () => {
      ws.close();
    };
    
  }, [token, VITE_WS_URL]);

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