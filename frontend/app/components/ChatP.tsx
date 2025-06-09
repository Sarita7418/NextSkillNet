'use client';

import React, { useEffect, useRef, useState } from 'react';
import SideMenu from './SideMenu'; // IMPORTANTE: ajusta la ruta si está en otro folder

interface ChatPProps {
  idChat: number;
  nombre: string;
  apellido: string;
  onVolver?: () => void;
}

interface Mensaje {
  id_mensaje: number;
  contenido: string;
  fecha_hor_envio: string;
  id_emisor: number;
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

  const [rolId, setRolId] = useState<number | null>(null);

useEffect(() => {
  const storedUsuario = localStorage.getItem('usuario');
  if (!storedUsuario) return;
  const usuario = JSON.parse(storedUsuario) as { id_rol?: string, id_usuario?: string };
  if (usuario.id_rol) setRolId(Number(usuario.id_rol));
  else if (usuario.id_usuario) {
    fetch(`http://127.0.0.1:8000/usuario/completo/${usuario.id_usuario}`)
      .then(res => res.json())
      .then(data => setRolId(Number(data.id_rol)))
      .catch(() => { });
  }
}, []);

  return (
    <>
      <div style={chatContainerStyle}>
        {/* HEADER */}
        <div style={headerStyle}>
          <a href="/Chats">
            <button style={volverBtnStyle}>Regresar</button>
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
              Entrevista
            </button>
 

        </div>

        {/* MENÚ LATERAL */}
        <SideMenu open={sideOpen} onClose={() => setSideOpen(false)} idChat={idChat} />

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
                <div style={{
                  fontSize: 12,
                  color: msg.id_emisor === idEmisor ? '#e0e7ff' : '#5b5b6d',
                  marginTop: 5,
                  textAlign: 'right'
                }}>
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

const azul = '#143D8D';

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
