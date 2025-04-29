import React from 'react';
import { FaCheck } from 'react-icons/fa';
import './MessageList.css';

interface Message {
  text: string;
  sent: boolean;
}

const messages: Message[] = [
  { text: 'Hola mucho gusto.!!', sent: true },
  { text: 'Necesitaría tomar una reunión', sent: true },
  { text: '¿Qué es lo que solicita?', sent: true },
  { text: 'Requiere presentar estos documentos', sent: true },
];

const MessageList: React.FC = () => (
  <ul className="message-list">
    {messages.map((msg, idx) => (
      <li key={idx} className={msg.sent ? 'sent' : 'received'}>
        <span className="message-text">{msg.text}</span>
        {msg.sent && <FaCheck className="check-icon" />}
      </li>
    ))}
  </ul>
);

export default MessageList;
