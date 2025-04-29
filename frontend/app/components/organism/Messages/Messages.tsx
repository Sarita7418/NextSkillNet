import React from 'react';
import './Messages.css';
import MessageList from '../../molecules/MessageList/MessageList';
import Tabs from '../../molecules/Tabs/Tabs';

const Messages: React.FC = () => (
  <aside className="messages-container">
    <h2>Mensajes</h2>
    <MessageList />
  </aside>
);

export default Messages;
