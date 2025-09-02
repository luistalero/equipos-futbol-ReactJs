import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  // Estado para manejar los datos del usuario y el token
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

  // Estados para manejar la visibilidad de los modales
  const [isSuspendedModalVisible, setIsSuspendedModalVisible] = useState(false);
  const [isAuthErrorModalVisible, setIsAuthErrorModalVisible] = useState(false);
  const navigate = useNavigate();

  // Variables de entorno para la API y WebSocket
  const API_URL = import.meta.env.VITE_API_BASE_URL_DOCKER;
  const VITE_WS_URL = import.meta.env.VITE_WS_URL;

  // Función para cerrar la sesión del usuario, limpia el estado y el almacenamiento local.
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

  // Función para cerrar los modales de alerta
  const handleModalClose = () => {
    setIsSuspendedModalVisible(false);
    setIsAuthErrorModalVisible(false);
  };
  
  // Primer useEffect: Se encarga de la validación del token y el estado del usuario.
  // Se ejecuta al cargar la aplicación y cada vez que el token cambie.
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

  // Segundo useEffect: Se encarga de la conexión WebSocket.
  // Se ejecuta solo cuando el userId está disponible, evitando conexiones innecesarias.
  useEffect(() => {
    let ws;
    if (userId) { 
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

  // Función para manejar el inicio de sesión
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

  // Propiedades derivadas para facilitar el uso en componentes
  const isAuthenticated = !!token;
  const isAdmin = role === 'admin';

  // Objeto que se devuelve para ser usado en el contexto
  const value = { 
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

  return value;
};

export default useAuth;
