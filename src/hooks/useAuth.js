import { useState, useEffect, useContext, createContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
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
  const [isAuthErrorModalVisible, setIsAuthErrorModalVisible] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL_DOCKER;
  const VITE_WS_URL = import.meta.env.VITE_WS_URL;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    setUserId(null);
    setIsSuspendedModalVisible(false);
    setIsAuthErrorModalVisible(false);
    navigate('/login');
  };

  const handleModalClose = () => {
    setIsSuspendedModalVisible(false);
    setIsAuthErrorModalVisible(false);
  };
  
  // Efecto para manejar la lógica de autenticación y la validación del token
  useEffect(() => {
    const checkTokenValidity = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            console.log('Token expirado.');
            logout();
            setIsAuthErrorModalVisible(true);
            return false;
          }
          const response = await axios.get(`${API_URL}/users/${decodedToken.id}/status`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (response.data.is_suspended) {
            logout();
            setIsSuspendedModalVisible(true);
          }
        } catch (error) {
          console.error('Error al validar el token o el estado del usuario:', error);
          if (error.response && error.response.status === 403) {
            logout();
            setIsAuthErrorModalVisible(true);
          }
        }
      }
    };
    checkTokenValidity();
  }, [token, API_URL]);

  // Efecto para manejar la conexión de WebSocket
  useEffect(() => {
    let ws;
    if (userId) { // Solo conecta si el userId está disponible
      ws = new WebSocket(VITE_WS_URL);
      ws.onopen = () => {
        console.log('Conectado al WebSocket.');
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
      ws.onclose = () => { console.log('Conexión WebSocket cerrada.'); };
      ws.onerror = (error) => { console.error('Error en el WebSocket:', error); };
    }
    
    // Función de limpieza para cerrar la conexión del WebSocket
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [userId, token, VITE_WS_URL]);

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

  return { 
    token, 
    isAuthenticated, 
    isAdmin, 
    userId, 
    isSuspendedModalVisible, 
    isAuthErrorModalVisible,
    handleModalClose, 
    login, 
    logout 
  };
};

export default useAuth;
