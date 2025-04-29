import React from 'react';
import { FaFileAlt } from 'react-icons/fa';
import './NotificationsList.css';

const data = [
  { text: 'Un administrador de sistemas ha revisado tu experiencia en gestión de redes inalámbricas.', time: '4 horas' },
  { text: 'Tu análisis sobre el rendimiento de redes en ambientes educativos está generando interacción.', time: '1 hora' },
  { text: 'Andrea López te ha solicitado una recomendación por tu apoyo en proyectos de redes.', time: '8 horas' },
];

const NotificationsList: React.FC = () => (
  <ul className="notif-list">
    {data.map((item, i) => (
      <li key={i}>
        <FaFileAlt className="notif-icon" />
        <p className="notif-text">{item.text}</p>
        <span className="notif-time">{item.time}</span>
      </li>
    ))}
  </ul>
);

export default NotificationsList;
