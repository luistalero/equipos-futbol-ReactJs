import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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

    // Configura el polling para refrescar los mensajes cada 5 segundos
    // intervalId = setInterval(fetchMessages, 5000);

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
        await axios.post(`${API_URL}/messages/send`, messagePayload, {
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
        className="fixed bottom-6 right-6 z-50 p-4 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 focus:outline-none"
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-sm h-96">
      {/* Encabezado del chat */}
      <div className="flex items-center justify-between p-4 bg-gray-900 text-white border-b-2 border-gray-700">
        <h3 className="text-lg font-bold">Soporte Técnico</h3>
        <button
          onClick={() => setIsChatVisible(false)}
          className="p-1 rounded-full hover:bg-gray-700 transition-colors focus:outline-none"
          aria-label="Cerrar chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Área de mensajes */}
      <div ref={chatMessagesRef} className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex my-2 ${isMyMessage(msg) ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-xl max-w-[80%] break-words ${
                isMyMessage(msg) ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-900'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className={`text-xs block text-right mt-1 ${isMyMessage(msg) ? 'text-gray-200' : 'text-gray-600'}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario de entrada de mensajes */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t-2 border-gray-200">
        <div className="flex rounded-full overflow-hidden border border-gray-400">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 text-gray-900 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 bg-gray-900 text-white hover:bg-gray-700 transition-colors focus:outline-none"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
