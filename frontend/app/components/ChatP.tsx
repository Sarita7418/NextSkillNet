'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ChatPProps {
  idChat: number;
  nombre: string;
  apellido: string;
  onVolver?: () => void; // Recibe función para volver a la lista (opcional, para control de navegación)
}

interface Mensaje {
  id_mensaje: number;
  contenido: string;
  fecha_hor_envio: string;
  id_emisor: number;
}

function SideMenu({ open, onClose }: { open: boolean, onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: open ? 0 : '-30vw',
        width: '25vw',
        height: '100vh',
        background: '#fff',
        boxShadow: open ? '-2px 0 24px rgba(20,61,141,0.10)' : 'none',
        zIndex: 20,
        transition: 'right 0.3s',
        padding: '48px 32px'
      }}
    >
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          fontSize: 28,
          color: azul,
          position: 'absolute',
          right: 18,
          top: 10,
          cursor: 'pointer'
        }}
        aria-label="Cerrar menú"
      >×</button>
      <h1 style={{ color: azul, marginTop: 40 }}>En proceso</h1>
    </div>
  );
}

const ChatP: React.FC<ChatPProps> = ({ idChat, nombre, apellido, onVolver }) => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [sideOpen, setSideOpen] = useState(false);
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  // id_usuario siempre
  const usuario = typeof window !== 'undefined' && localStorage.getItem('usuario')
    ? JSON.parse(localStorage.getItem('usuario') as string)
    : null;
  const idEmisor: number = usuario?.id_usuario;

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/chats/${idChat}/mensajes`)
      .then(res => res.json())
      .then((data: Mensaje[]) => setMensajes(data))
      .catch(() => setMensajes([]));
  }, [idChat]);

  useEffect(() => {
  }, [mensajes]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;
    const body = {
      contenido: nuevoMensaje,
      id_chat: idChat,
      id_emisor: idEmisor
    };
    const res = await fetch('http://127.0.0.1:8000/chats/mensajes/agregar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.mensaje) {
      setMensajes([...mensajes, data.mensaje]);
      setNuevoMensaje('');
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') enviarMensaje();
  };

  return (
    <>
    <div style={chatContainerStyle}>
        {/* HEADER */}
      <div style={headerStyle}>
        <a href="/Chats">
            <button style={volverBtnStyle}>
          Volver a los chats
        </button>
        </a>
        
        {/* Nombre al centro */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontSize: 22, color: azul, fontWeight: 600 }}>{nombre} {apellido}</span>
          <br />
          <span style={{ color: '#727272', fontSize: 13 }}>En línea</span>
        </div>

        {/* Botón menú lateral (derecha) */}
        <button
          onClick={() => setSideOpen(true)}
          style={volverBtnStyle}
        >
          Agendar entrevista
        </button>
      </div>

      {/* MENÚ LATERAL */}
      <SideMenu open={sideOpen} onClose={() => setSideOpen(false)} />

      {/* MENSAJES */}
      <div style={mensajesAreaStyle}>
        {mensajes.map(msg => (
          <div
            key={msg.id_mensaje}
            style={{
              display: 'flex',
              justifyContent: msg.id_emisor === idEmisor ? 'flex-end' : 'flex-start',
              marginBottom: 12
            }}
          >
            <div
              style={{
                background: msg.id_emisor === idEmisor ? azul : '#e7eaf6',
                color: msg.id_emisor === idEmisor ? '#fff' : '#222',
                borderRadius: 14,
                padding: '10px 18px',
                maxWidth: '65%',
                fontSize: '1.1rem',
                boxShadow: '0 1px 7px rgba(20,61,141,0.09)'
              }}
            >
              {msg.contenido}
              <div style={{ fontSize: 12, color: msg.id_emisor === idEmisor ? '#e0e7ff' : '#5b5b6d', marginTop: 5, textAlign: 'right' }}>
                {new Date(msg.fecha_hor_envio).toLocaleString('es-BO', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={mensajesEndRef}></div>
      </div>

      {/* ENVIAR MENSAJE */}
      <div style={inputBarStyle}>
        <input
          style={inputStyle}
          type="text"
          value={nuevoMensaje}
          onChange={e => setNuevoMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
          onKeyDown={handleInputKeyDown}
        />
        <button style={enviarBtnStyle} onClick={enviarMensaje}>Enviar</button>
      </div>
    </div>
      
    </>
  );
};

export default ChatP;

// ----------- ESTILOS -----------

const azul = '#143D8D';

const chatContainerStyle: React.CSSProperties = {
  width: '70vw',
  minWidth: 340,
  maxWidth: 900,
  height: '70vh',
  minHeight: 550,
  margin: '48px auto',
  borderRadius: 22,
  background: '#f9fafc',
  boxShadow: '0 6px 28px rgba(20, 61, 141, 0.13)',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
};

const headerStyle: React.CSSProperties = {
  padding: '22px 32px 14px 32px',
  borderBottom: `2px solid ${azul}22`,
  background: '#fff',
  borderTopLeftRadius: 22,
  borderTopRightRadius: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 3,
  gap: 18
};

const volverBtnStyle: React.CSSProperties = {
  background: '#fff',
  color: azul,
  border: `2px solid ${azul}`,
  borderRadius: 8,
  fontWeight: 600,
  padding: '6px 18px',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'background 0.18s, color 0.18s',
};

const menuBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 32,
  color: azul,
  cursor: 'pointer',
  minWidth: 48,
  textAlign: 'right',
};

const mensajesAreaStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '24px 38px',
  background: '#f9fafc',
  minHeight: 300,
  position: 'relative'
};

const inputBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  borderTop: `2px solid ${azul}22`,
  background: '#fff',
  borderBottomLeftRadius: 22,
  borderBottomRightRadius: 22,
  padding: '14px 28px',
  gap: 14
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  fontSize: '1.1rem',
  borderRadius: 8,
  border: `1px solid #e3e7f2`,
  padding: '9px 14px',
  outline: 'none',
  background: '#f2f6fc'
};

const enviarBtnStyle: React.CSSProperties = {
  background: azul,
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '9px 26px',
  fontWeight: 600,
  fontSize: '1.08rem',
  cursor: 'pointer',
  marginLeft: 10
};
