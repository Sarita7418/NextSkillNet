'use client';

import { useEffect, useState } from 'react';
import ChatP from './ChatP';

interface Chat {
    id_chat: number;
    nombre: string;
    apellido: string;
    ultimo_mensaje: string;
    fecha_ultimo_mensaje: string | null;
}

const ROLES: Record<number, 'persona' | 'administrador' | 'representante' | 'aspirante'> = {
    1: 'persona',
    2: 'administrador',
    3: 'representante',
    4: 'aspirante'
};

export default function ChatsLista() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('usuario');
        if (!stored) {
            setError('No hay usuario en sesión');
            setLoading(false);
            return;
        }
        const usuario = JSON.parse(stored);
        const rolNum: number = Number(usuario.id_rol);

        let endpointTipo = '';
        let endpointId = '';

        if (rolNum === 3) {
            endpointTipo = 'representante';
            endpointId = usuario.id_usuario;
        } else if (rolNum === 1) {
            endpointTipo = 'persona';
            endpointId = usuario.id_usuario;
            if (!endpointId) {
                setError('No se encontró id_persona en el usuario');
                setLoading(false);
                return;
            }
        } else {
            setError('No tienes chats disponibles para este rol');
            setLoading(false);
            return;
        }

        fetch(`http://127.0.0.1:8000/chats/listar?tipo=${endpointTipo}&id=${endpointId}`)
            .then(res => res.json())
            .then((data: Chat[]) => {
                setChats(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Error al obtener los chats');
                setLoading(false);
            });
    }, []);

    if (selectedChat !== null) {
        return (
            <div style={containerStyle}>
                <ChatP
                    idChat={selectedChat.id_chat}
                    nombre={selectedChat.nombre}
                    apellido={selectedChat.apellido}
                />
            </div>
        );
    }

    if (loading) return <div style={containerStyle}>Cargando chats...</div>;
    if (error) return <div style={containerStyle}>{error}</div>;
    if (!chats.length) return <div style={containerStyle}>No tienes chats aún.</div>;

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Mis Chats</h2>
            <ul style={listStyle}>
                {chats.map((chat) => (
                    <li key={chat.id_chat} style={itemStyle}>
                        <div style={infoStyle}>
                            <span style={nombreStyle}>
                                {chat.nombre} {chat.apellido}
                            </span>
                            <span style={ultimoStyle}>
                                Último mensaje: {chat.ultimo_mensaje}
                            </span>
                            {chat.fecha_ultimo_mensaje && (
                                <span style={fechaStyle}>
                                    {new Date(chat.fecha_ultimo_mensaje).toLocaleDateString('es-BO')}{" "}
                                    {new Date(chat.fecha_ultimo_mensaje).toLocaleTimeString('es-BO', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            )}
                        </div>
                        <button
                            style={botonStyle}
                            onClick={() => setSelectedChat(chat)}
                        >
                            Abrir chat
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
// ----------- ESTILOS EN JS -------------
const azul = "#143D8D";

const containerStyle: React.CSSProperties = {
    width: '80vw',
    margin: '40px auto',

};

const volverBtnStyle: React.CSSProperties = {
    background: '#fff',
    color: azul,
    border: `2px solid ${azul}`,
    borderRadius: 8,
    fontWeight: 600,
    padding: '6px 18px',
    cursor: 'pointer',
    marginBottom: 20,
    fontSize: '1rem',
    transition: 'background 0.18s, color 0.18s',
};

const titleStyle: React.CSSProperties = {
    color: azul,
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: '1px',
};

const listStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
};

const itemStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 16,
    marginBottom: 18,
    padding: '18px 20px',
    boxShadow: '0 2px 12px rgba(20, 61, 141, 0.07)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'box-shadow 0.2s',
};

const infoStyle: React.CSSProperties = {
    flex: 1,
};

const nombreStyle: React.CSSProperties = {
    color: azul,
    fontWeight: 600,
    fontSize: '1.14rem',
    marginBottom: 2,
    display: 'block',
};

const ultimoStyle: React.CSSProperties = {
    color: '#3c3c3c',
    fontSize: '0.97rem',
};

const fechaStyle: React.CSSProperties = {
    color: '#8a8fa3',
    fontSize: '0.85rem',
    marginTop: 2,
    display: 'block',
};

const botonStyle: React.CSSProperties = {
    background: azul,
    color: '#fff',
    border: 'none',
    padding: '8px 20px',
    borderRadius: 8,
    fontWeight: 500,
    fontSize: '1rem',
    cursor: 'pointer',
    marginLeft: 18,
    transition: 'background 0.18s',
};
