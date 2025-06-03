import React, { useEffect, useState } from 'react';

interface Item {
    id: number;
    descripcion: string;
}

function HabilidadesIdiomas() {
    const [usuario, setUsuario] = useState<{ id_usuario: number } | null>(null);

    const [habilidadesDisponibles, setHabilidadesDisponibles] = useState<Item[]>([]);
    const [idiomasDisponibles, setIdiomasDisponibles] = useState<Item[]>([]);

    const [habilidadesUsuario, setHabilidadesUsuario] = useState<Item[]>([]);
    const [idiomasUsuario, setIdiomasUsuario] = useState<Item[]>([]);

    const [showAddHabilidad, setShowAddHabilidad] = useState(false);
    const [showAddIdioma, setShowAddIdioma] = useState(false);

    const [nuevaHabilidad, setNuevaHabilidad] = useState('');
    const [nuevoIdioma, setNuevoIdioma] = useState('');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const u = localStorage.getItem('usuario');
            if (u) {
                try {
                    const userParsed = JSON.parse(u);
                    setUsuario(userParsed);
                    console.log('Usuario cargado:', userParsed);
                } catch (error) {
                    console.error('Error parseando usuario desde localStorage:', error);
                }
            }
        }
    }, []);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/habilidades')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log('Habilidades disponibles:', data);
                setHabilidadesDisponibles(data);
            })
            .catch((err) => {
                console.error('Error cargando habilidades:', err);
                alert('Error cargando habilidades');
            });

        fetch('http://127.0.0.1:8000/idiomas')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log('Idiomas disponibles:', data);
                setIdiomasDisponibles(data);
            })
            .catch((err) => {
                console.error('Error cargando idiomas:', err);
                alert('Error cargando idiomas');
            });
    }, []);

    useEffect(() => {
        if (!usuario?.id_usuario) return;

        fetch(`http://127.0.0.1:8000/usuario/${usuario.id_usuario}/habilidades`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log('Habilidades del usuario:', data);
                setHabilidadesUsuario(data);
            })
            .catch(err => {
                console.error('Error cargando habilidades del usuario:', err);
                alert('Error cargando habilidades del usuario');
            });

        fetch(`http://127.0.0.1:8000/usuario/${usuario.id_usuario}/idiomas`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log('Idiomas del usuario:', data);
                setIdiomasUsuario(data);
            })
            .catch(err => {
                console.error('Error cargando idiomas del usuario:', err);
                alert('Error cargando idiomas del usuario');
            });
    }, [usuario?.id_usuario]);

    const agregarHabilidad = () => {
        console.log('Intentando agregar habilidad:', nuevaHabilidad);
        if (!nuevaHabilidad) return;
        if (habilidadesUsuario.find(h => h.id == Number(nuevaHabilidad))) {
            alert('Esta habilidad ya está añadida.');
            return;
        }
        const hab = habilidadesDisponibles.find(h => h.id == Number(nuevaHabilidad));
        if (hab) {
            setHabilidadesUsuario(prev => {
                const nuevoArray = [...prev, hab];
                console.log('Nuevo array de habilidades usuario:', nuevoArray);
                return nuevoArray;
            });
            setNuevaHabilidad('');
            setShowAddHabilidad(false);
        } else {
            console.warn('No se encontró la habilidad en habilidadesDisponibles con id:', nuevaHabilidad);
        }
    };


    const agregarIdioma = () => {
        console.log('Intentando agregar idioma:', nuevoIdioma);
        try {
            if (!nuevoIdioma) {
                console.log('No hay idioma seleccionado');
                return;
            }
            if (idiomasUsuario.find(i => i.id == Number(nuevoIdioma))) {
                alert('Este idioma ya está añadido.');
                return;
            }
            const idi = idiomasDisponibles.find(i => i.id == Number(nuevoIdioma));
            if (idi) {
                setIdiomasUsuario([...idiomasUsuario, idi]);
                setNuevoIdioma('');
                setShowAddIdioma(false);
                console.log('Idioma añadido:', idi);
            }
        } catch (error) {
            console.error('Error en agregarIdioma:', error);
        }
    };

    const quitarHabilidad = (id: number) => {
        console.log('Quitando habilidad con id:', id);
        setHabilidadesUsuario(habilidadesUsuario.filter(h => h.id !== id));
    };

    const quitarIdioma = (id: number) => {
        console.log('Quitando idioma con id:', id);
        setIdiomasUsuario(idiomasUsuario.filter(i => i.id !== id));
    };

    const handleGuardar = async () => {
        if (!usuario?.id_usuario) {
            console.log('No hay usuario cargado para guardar');
            return;
        }
        setLoading(true);
        console.log('Guardando datos...');
        try {
            let res = await fetch('http://127.0.0.1:8000/usuario/habilidades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: usuario.id_usuario,
                    habilidades: habilidadesUsuario.map(h => h.id),
                }),
            });
            if (!res.ok) throw new Error('Error guardando habilidades');

            res = await fetch('http://127.0.0.1:8000/usuario/idiomas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: usuario.id_usuario,
                    idiomas: idiomasUsuario.map(i => i.id),
                }),
            });
            if (!res.ok) throw new Error('Error guardando idiomas');

            alert('Datos guardados correctamente');
            console.log('Datos guardados correctamente');
        } catch (error) {
            console.error('Error en handleGuardar:', error);
            alert(error instanceof Error ? error.message : 'Error en la conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 700, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
            {/* Tabla Habilidades */}
            <h2>Habilidades Blandas</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }} border={1}>
                <thead style={{ backgroundColor: '#143D8D', color: 'white' }}>
                    <tr>
                        <th style={{ padding: '8px' }}>Descripción</th>
                        <th style={{ padding: '8px', width: 80 }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {habilidadesUsuario.length === 0 ? (
                        <tr>
                            <td colSpan={2} style={{ padding: 12, textAlign: 'center', fontStyle: 'italic' }}>
                                No se han guardado habilidades blandas aún.
                            </td>
                        </tr>
                    ) : (
                        habilidadesUsuario.map(h => (
                            <tr key={h.id}>
                                <td style={{ padding: 8 }}>{h.descripcion}</td>
                                <td style={{ padding: 8, textAlign: 'center' }}>
                                    <button
                                        onClick={() => quitarHabilidad(h.id)}
                                        disabled={loading}
                                        style={{
                                            backgroundColor: '#e53e3e',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: 5,
                                            padding: '4px 8px',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            fontWeight: 'bold',
                                        }}
                                        title="Eliminar"
                                    >
                                        X
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {!showAddHabilidad ? (
                <button
                    onClick={() => setShowAddHabilidad(true)}
                    disabled={loading}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#143D8D',
                        color: 'white',
                        borderRadius: 8,
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        marginBottom: 20,
                    }}
                >
                    Añadir habilidad
                </button>
            ) : (
                <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
                    <select
                        value={nuevaHabilidad}
                        onChange={(e) => setNuevaHabilidad(e.target.value)}
                        disabled={loading}
                        style={{ padding: '8px', borderRadius: 8, border: '1px solid #ccc', flex: 1, fontSize: 16 }}
                    >
                        <option value="">Seleccione una habilidad</option>
                        {habilidadesDisponibles
                            .filter(h => !habilidadesUsuario.some(hu => hu.id === h.id))
                            .map(h => (
                                <option key={h.id} value={h.id}>
                                    {h.descripcion}
                                </option>
                            ))}
                    </select>
                    <button
                        onClick={agregarHabilidad}
                        disabled={loading || !nuevaHabilidad}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#143D8D',
                            color: 'white',
                            borderRadius: 8,
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Añadir
                    </button>
                    <button
                        onClick={() => setShowAddHabilidad(false)}
                        disabled={loading}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#999',
                            color: 'white',
                            borderRadius: 8,
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            )}

            {/* Tabla Idiomas */}
            <h2>Idiomas</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }} border={1}>
                <thead style={{ backgroundColor: '#143D8D', color: 'white' }}>
                    <tr>
                        <th style={{ padding: '8px' }}>Descripción</th>
                        <th style={{ padding: '8px', width: 80 }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {idiomasUsuario.length === 0 ? (
                        <tr>
                            <td colSpan={2} style={{ padding: 12, textAlign: 'center', fontStyle: 'italic' }}>
                                No se han guardado idiomas aún.
                            </td>
                        </tr>
                    ) : (
                        idiomasUsuario.map(i => (
                            <tr key={i.id}>
                                <td style={{ padding: 8 }}>{i.descripcion}</td>
                                <td style={{ padding: 8, textAlign: 'center' }}>
                                    <button
                                        onClick={() => quitarIdioma(i.id)}
                                        disabled={loading}
                                        style={{
                                            backgroundColor: '#e53e3e',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: 5,
                                            padding: '4px 8px',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            fontWeight: 'bold',
                                        }}
                                        title="Eliminar"
                                    >
                                        X
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {!showAddIdioma ? (
                <button
                    onClick={() => setShowAddIdioma(true)}
                    disabled={loading}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#143D8D',
                        color: 'white',
                        borderRadius: 8,
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        marginBottom: 20,
                    }}
                >
                    Añadir idioma
                </button>
            ) : (
                <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
                    <select
                        value={nuevoIdioma}
                        onChange={(e) => setNuevoIdioma(e.target.value)}
                        disabled={loading}
                        style={{ padding: '8px', borderRadius: 8, border: '1px solid #ccc', flex: 1, fontSize: 16 }}
                    >
                        <option value="">Seleccione un idioma</option>
                        {idiomasDisponibles
                            .filter(i => !idiomasUsuario.some(iu => iu.id === i.id))
                            .map(i => (
                                <option key={i.id} value={i.id}>
                                    {i.descripcion}
                                </option>
                            ))}
                    </select>
                    <button
                        onClick={agregarIdioma}
                        disabled={loading || !nuevoIdioma}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#143D8D',
                            color: 'white',
                            borderRadius: 8,
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Añadir
                    </button>
                    <button
                        onClick={() => setShowAddIdioma(false)}
                        disabled={loading}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#999',
                            color: 'white',
                            borderRadius: 8,
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            )}

            <button
                onClick={handleGuardar}
                disabled={loading}
                style={{
                    padding: '12px 20px',
                    backgroundColor: '#143D8D',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: 16,
                    display: 'block',
                    margin: '0 auto',
                    transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#0f326a';
                }}
                onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#143D8D';
                }}
            >
                {loading ? 'Guardando...' : 'Guardar'}
            </button>
        </div>
    );
}

export default HabilidadesIdiomas;
