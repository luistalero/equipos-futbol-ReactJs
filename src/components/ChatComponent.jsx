import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/components/chat.css'; // Importa el nuevo archivo de estilos

// Define la URL de la API
const API_URL = import.meta.env.VITE_API_BASE_URL_DOCKER || 'https://equipos-futbol-nodejs-production.up.railway.app/api';

const ChatComponent = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(false);
  const chatMessagesRef = useRef(null);
  
  // Efecto para cargar y refrescar los mensajes del servidor
  useEffect(() => {
    let intervalId;
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) return;

        const endpoint = `${API_URL}/chats/${userId}`;
        
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error al obtener los mensajes:', error);
      }
    };

    // Carga los mensajes inmediatamente
    fetchMessages();

    intervalId = setInterval(fetchMessages, 1000);

    // Limpieza al desmontar el componente
    return () => clearInterval(intervalId);
  }, [userId]);

  // Efecto para que el chat se desplace automáticamente hacia el final
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, isChatVisible]);

  // Función para manejar el envío de mensajes a través de la API REST
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        
        const messagePayload = {
            userId: decodedToken.id, // Tu backend espera 'userId'
            message: newMessage, // Tu backend espera 'message'
        };
        
        // Envia el mensaje a través de la API REST
        await axios.post(`${API_URL}/chats/send`, messagePayload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Limpia el input del mensaje
        setNewMessage('');
        
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
  };

  const isMyMessage = (message) => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const decodedToken = jwtDecode(token);
    // El modelo de Chat en tu backend usa 'sender' y 'user', no 'senderId'
    return message.sender === 'user' && message.userId === decodedToken.id; 
  };

  // Burbuja de chat para alternar la visibilidad
  if (!isChatVisible) {
    return (
      <button
        onClick={() => setIsChatVisible(true)}
        className="chat-bubble-button"
        aria-label="Abrir chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    );
  }

  // Ventana del chat completa
  return (
    <div className="chat-container">
      {/* Encabezado del chat */}
      <div className="chat-header">
        <h3 className="chat-header-title">Soporte Técnico</h3>
        <button
          onClick={() => setIsChatVisible(false)}
          className="chat-header-close-button"
          aria-label="Cerrar chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Área de mensajes */}
      <div ref={chatMessagesRef} className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message-wrapper ${isMyMessage(msg) ? 'chat-message-sent' : 'chat-message-received'}`}
          >
            <div
              className={`chat-message-bubble ${isMyMessage(msg) ? 'sent' : 'received'}`}
            >
              <p className="chat-message-text">{msg.text}</p>
              <span className="chat-message-timestamp">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario de entrada de mensajes */}
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <div className="chat-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="chat-input-field"
          />
          <button
            type="submit"
            className="chat-send-button"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
