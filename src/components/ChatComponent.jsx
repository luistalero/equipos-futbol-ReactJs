import React, { useState, useEffect } from 'react';

// Reemplaza esto con tu URL base del backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DOCKER; 

// Acepta la prop userId que viene del componente padre
const ChatComponent = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        // Usa la prop userId en la URL
        const response = await fetch(`${API_BASE_URL}/chat-history/${userId}`);
        if (!response.ok) {
          throw new Error('Error al obtener el historial de chat');
        }
        const history = await response.json();
        setMessages(history);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    // El efecto se ejecuta solo si hay un userId válido
    if (userId) {
      fetchChatHistory();
    }
    
  }, [userId]); // El efecto se vuelve a ejecutar si la prop userId cambia

  const sendMessageToBackend = async (userMessage) => {
    try {
      const response = await fetch(`${API_BASE_URL}/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId, // Usa la prop userId en el cuerpo de la solicitud
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje al backend');
      }

      const updatedHistory = await response.json();
      setMessages(updatedHistory);
    } catch (error) {
      console.error('Error al comunicarse con el backend:', error);
      const n8nResponse = { text: "Lo siento, hubo un error. Por favor, inténtalo de nuevo más tarde.", sender: 'n8n' };
      setMessages(prevMessages => [...prevMessages, n8nResponse]);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessageObject = {
      text: inputValue,
      sender: 'user',
    };
    setMessages(prevMessages => [...prevMessages, userMessageObject]);
    setInputValue('');
    
    sendMessageToBackend(inputValue);
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', maxWidth: '400px', margin: 'auto' }}>
      {isLoading ? (
        <div style={{ textAlign: 'center' }}>Cargando historial...</div>
      ) : (
        <div style={{ height: '300px', overflowY: 'scroll', marginBottom: '16px' }}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              style={{ 
                textAlign: msg.sender === 'user' ? 'right' : 'left', 
                marginBottom: '8px' 
              }}
            >
              <div 
                style={{ 
                  background: msg.sender === 'user' ? '#007bff' : '#f1f0f0', 
                  color: msg.sender === 'user' ? 'white' : 'black', 
                  padding: '8px', 
                  borderRadius: '12px', 
                  display: 'inline-block',
                  maxWidth: '70%'
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSendMessage} style={{ display: 'flex' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Escribe tu mensaje..."
          style={{ flexGrow: '1', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ marginLeft: '8px', padding: '8px 16px', border: 'none', borderRadius: '4px', background: '#007bff', color: 'white' }}>
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;