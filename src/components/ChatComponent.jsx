import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL =
  import.meta.env.VITE_API_BASE_URL_DOCKER ||
  'https://equipos-futbol-nodejs-production.up.railway.app/api';

const ChatComponent = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(false);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    let intervalId;
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) return;

        const endpoint = `${API_URL}/chats/${userId}`;
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error al obtener los mensajes:', error);
      }
    };

    fetchMessages();
    intervalId = setInterval(fetchMessages, 1000);

    return () => clearInterval(intervalId);
  }, [userId]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, isChatVisible]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);

      const messagePayload = {
        userId: decodedToken.id,
        message: newMessage,
      };

      await axios.post(`${API_URL}/chats/send`, messagePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  const isMyMessage = (message) => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const decodedToken = jwtDecode(token);
    return message.sender === 'user' && message.userId === decodedToken.id;
  };

  if (!isChatVisible) {
    return (
      <>
        <button
          onClick={() => setIsChatVisible(true)}
          className="chat-bubble-button"
          aria-label="Abrir chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>

        <style>{styles}</style>
      </>
    );
  }

  return (
    <>
      <div className="chat-container">
        <div className="chat-header">
          <h3 className="chat-header-title">Soporte Técnico</h3>
          <button
            onClick={() => setIsChatVisible(false)}
            className="chat-header-close-button"
            aria-label="Cerrar chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div ref={chatMessagesRef} className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message-wrapper ${
                isMyMessage(msg)
                  ? 'chat-message-sent'
                  : 'chat-message-received'
              }`}
            >
              <div
                className={`chat-message-bubble ${
                  isMyMessage(msg) ? 'sent' : 'received'
                }`}
              >
                <p className="chat-message-text">{msg.text}</p>
                <span className="chat-message-timestamp">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <div className="chat-input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="chat-input-field"
            />
            <button type="submit" className="chat-send-button">
              Enviar
            </button>
          </div>
        </form>
      </div>

      <style>{styles}</style>
    </>
  );
};

export default ChatComponent;

const styles = `
.chat-bubble-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #2563eb;
  color: white;
  border-radius: 50%;
  padding: 14px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.25);
  cursor: pointer;
  transition: transform 0.2s ease, background 0.3s ease;
  width: 70px;
  height: 70px;
}
.chat-bubble-button:hover {
  background: #1e40af;
  transform: scale(1.1);
}
.chat-container {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 320px;
  max-height: 500px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "Segoe UI", Tahoma, sans-serif;
  animation: fadeInUp 0.3s ease;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
.chat-header {
  background: #2563eb;
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chat-header-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}
.chat-header-close-button {
  background: transparent;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: black;
  transition: transform 0.2s ease;
}
.chat-header-close-button:hover {
  transform: scale(1.1);
}
.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: #f9fafb;
}
.chat-message-wrapper {
  display: flex;
  margin-bottom: 8px;
}
.chat-message-sent { justify-content: flex-end; }
.chat-message-received { justify-content: flex-start; }
.chat-message-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  position: relative;
  display: inline-block;
  word-wrap: break-word;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.chat-message-bubble.sent {
  background: #2563eb;
  color: white;
  border-bottom-right-radius: 4px;
}
.chat-message-bubble.received {
  background: #e5e7eb;
  color: #111827;
  border-bottom-left-radius: 4px;
}
.chat-message-text { margin: 0; }
.chat-message-timestamp {
  font-size: 11px;
  opacity: 0.7;
  display: block;
  margin-top: 4px;
  text-align: right;
}
.chat-input-form {
  border-top: 1px solid #e5e7eb;
  padding: 8px;
  background: white;
}
.chat-input-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
.chat-input-field {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  transition: border 0.2s ease, box-shadow 0.2s ease;
}
.chat-input-field:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37,99,235,0.3);
}
.chat-send-button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease, transform 0.2s ease;
}
.chat-send-button:hover {
  background: #1e40af;
  transform: scale(1.05);
}
`;
