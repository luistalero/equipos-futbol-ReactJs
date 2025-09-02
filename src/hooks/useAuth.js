import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [userId, setUserId] = useState(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        return decodedToken.id;
      } catch (error) {
        return null;
      }
    }
    return null;
  });

  const [isSuspendedModalVisible, setIsSuspendedModalVisible] = useState(false);
  const handleModalClose = () => {
    setIsSuspendedModalVisible(false);
  };
  
  const API_URL = import.meta.env.VITE_API_BASE_URL_DOCKER;
  const VITE_WS_URL = import.meta.env.VITE_WS_URL;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    setUserId(null);
    setIsSuspendedModalVisible(false);
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
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
          const currentUserId = decodedToken.id;
          const response = await axios.get(`${API_URL}/users/${currentUserId}/status`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (response.data.is_suspended) {
            logout();
            setIsSuspendedModalVisible(true);
          }
        } catch (error) {
          if (error.response && error.response.status === 403) {
            logout();
            alert('Tu sesión ha sido invalidada. Por favor, inicia sesión de nuevo.');
          }
        }
      }
    };

    checkTokenExpiration();
    checkUserSuspension();

    const ws = new WebSocket(VITE_WS_URL);
    ws.onopen = () => {
      if (token) {
        ws.send(JSON.stringify({ type: 'auth', token }));
      }
    };
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'user-status' && message.status === 'suspended') {
            logout();
            setIsSuspendedModalVisible(true);
        }
      } catch (error) {
        console.error('Error al procesar el mensaje del WebSocket:', error);
      }
    };
    ws.onclose = () => { };
    ws.onerror = (error) => { };

    return () => {
      ws.close();
    };
    
  }, [token, VITE_WS_URL, API_URL]);

  const login = (jwtToken, userRole) => {
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('role', userRole);
    setToken(jwtToken);
    setRole(userRole);
    try {
      const decodedToken = jwtDecode(jwtToken);
      setUserId(decodedToken.id);
    } catch (error) {
      setUserId(null);
    }
  };

  const isAuthenticated = !!token;
  const isAdmin = role === 'admin';

  return { token, isAuthenticated, isAdmin, userId, isSuspendedModalVisible, handleModalClose, login, logout };
};

export default useAuth;