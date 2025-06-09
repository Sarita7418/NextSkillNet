'use client';
import React, { useEffect, useState } from 'react';
import './Formularios.css';

interface Entrevista {
    id_entrevista: number;
    fecha_hor_programada: string;
    id_chat: number;
    direccion: string;
}

interface SideMenuProps {
    open: boolean;
    onClose: () => void;
    idChat: number;
}

const azul = '#143D8D';

function diasRestantes(fechaISO: string) {
    const hoy = new Date();
    const fecha = new Date(fechaISO);
    const diff = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
}

function formatearFechaHora(fechaISO: string) {
    if (!fechaISO) return { fecha: '', hora: '' };
    const dt = new Date(fechaISO);
    const fecha = dt.toISOString().slice(0, 10);
    const hora = dt.toTimeString().slice(0, 5);
    return { fecha, hora };
}

function combinarFechaHora(fecha: string, hora: string) {
    if (!fecha || !hora) return '';
    return `${fecha}T${hora}`;
}

const SideMenu: React.FC<SideMenuProps> = ({ open, onClose, idChat }) => {
    const [entrevista, setEntrevista] = useState<Entrevista | null>(null);
    const [modoEditar, setModoEditar] = useState(false);
    const [form, setForm] = useState({ fecha: '', hora: '', direccion: '' });
    const [errores, setErrores] = useState<{ fecha?: string; hora?: string; direccion?: string }>({});
    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (open) {
            setCargando(true);
            fetch(`http://127.0.0.1:8000/entrevista/${idChat}`)
                .then(res => res.json())
                .then(data => {
                    if (data.mensaje === 'Sin entrevista') {
                        setEntrevista(null);
                        setForm({ fecha: '', hora: '', direccion: '' });
                    } else {
                        setEntrevista(data);
                        const { fecha, hora } = formatearFechaHora(data.fecha_hor_programada);
                        setForm({
                            fecha,
                            hora,
                            direccion: data.direccion ?? ''
                        });
                    }
                })
                .catch(() => setEntrevista(null))
                .finally(() => setCargando(false));
            setModoEditar(false);
            setErrores({});
        }
        // eslint-disable-next-line
    }, [open, idChat]);

    // Validaciones
    function validar() {
        const e: { fecha?: string; hora?: string; direccion?: string } = {};
        if (!form.fecha) e.fecha = 'La fecha es obligatoria*';
        else {
            // Solo validamos la fecha sea estrictamente futura
            const fechaForm = new Date(form.fecha);
            // Comparamos solo la parte de la fecha (ignorando hora)
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            fechaForm.setHours(0, 0, 0, 0);
            if (fechaForm <= hoy) e.fecha = 'La fecha debe ser futura*';
        }
        if (!form.hora) e.hora = 'La hora es obligatoria*';
        if (!form.direccion) e.direccion = 'Campo obligatorio*';
        setErrores(e);
        return Object.keys(e).length === 0;
    }


    // Crear
    async function crearEntrevista() {
        if (!validar()) return;
        setGuardando(true);
        const payload = {
            fecha_hor_programada: combinarFechaHora(form.fecha, form.hora),
            direccion: form.direccion,
            // NO mandes estado ni id_entrevista, el backend pone null
        };


        try {
            const res = await fetch(`http://127.0.0.1:8000/entrevista/${idChat}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            alert('Entrevista creada correctamente');
            if (!res.ok) throw new Error('No se pudo crear');
            onClose();
        } finally {
            setGuardando(false);
        }
    }

    // Editar
    async function guardarCambios() {
        if (!validar()) return;
        setGuardando(true);
        const payload = {
            fecha_hor_programada: combinarFechaHora(form.fecha, form.hora),
            direccion: form.direccion,
            estado: null
        };
        try {
            const res = await fetch(`http://127.0.0.1:8000/entrevista/${idChat}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('No se pudo editar');
            alert('Entrevista actualizada correctamente');
            setModoEditar(false);
            onClose();
        } finally {
            setGuardando(false);
        }
    }

    // ------ Render ------

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                right: open ? 0 : '-30vw',
                width: '25vw',
                minWidth: 320,
                height: '100vh',
                background: '#fff',
                boxShadow: open ? '-2px 0 24px rgba(20,61,141,0.10)' : 'none',
                zIndex: 20,
                transition: 'right 0.3s',
                padding: '32px 12px'
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

            <div className="form-container-std" style={{ boxShadow: 'none', margin: '24px 0 0 0', minHeight: 'auto' }}>
                {/* Título grande y delineado */}
                <h2
                    className="titulo"
                    style={{
                        marginBottom: 18,
                        color: azul,
                        fontWeight: 800,
                        fontSize: 34,
                        letterSpacing: '1.5px',
                        textAlign: 'center',
                        textShadow: `0px 2px 10px #e0e7ef`
                    }}
                >Entrevista</h2>
                <div className="form-card-std">
                    {cargando ? (
                        <div style={{ textAlign: 'center', padding: 30 }}>Cargando...</div>
                    ) : !entrevista ? (
                        <>
                            <div style={{ color: '#888', fontSize: 16, marginBottom: 22 }}>
                                No se tienen entrevistas creadas.<br />¿Deseas crear una? Llena los campos de abajo y guárdalos.
                            </div>
                            {/* Fecha */}
                            <div className="form-group-std">
                                <label className="form-label-std">
                                    Fecha de la entrevista
                                    {errores.fecha && <span className="msg-error-std">{errores.fecha}</span>}
                                </label>
                                <input
                                    className={`input-std${errores.fecha ? ' error' : ''}`}
                                    type="date"
                                    value={form.fecha}
                                    onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                                    min={new Date().toISOString().slice(0, 10)}
                                />
                            </div>
                            {/* Hora */}
                            <div className="form-group-std">
                                <label className="form-label-std">
                                    Hora de la entrevista
                                    {errores.hora && <span className="msg-error-std">{errores.hora}</span>}
                                </label>
                                <input
                                    className={`input-std${errores.hora ? ' error' : ''}`}
                                    type="time"
                                    value={form.hora}
                                    onChange={e => setForm(f => ({ ...f, hora: e.target.value }))}
                                />
                                {errores.hora && <span className="msg-error-std">{errores.hora}</span>}

                            </div>
                            {/* Dirección */}
                            <div className="form-group-std">
                                <label className="form-label-std">
                                    Dirección
                                    {errores.direccion && <span className="msg-error-std">{errores.direccion}</span>}
                                </label>
                                <input
                                    className={`input-std${errores.direccion ? ' error' : ''}`}
                                    type="text"
                                    value={form.direccion}
                                    onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))}
                                    placeholder="Dirección de la entrevista"
                                />
                            </div>
                            <button className="btn-save-std" onClick={crearEntrevista} disabled={guardando}>
                                {guardando ? 'Guardando...' : 'Crear'}
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Fecha */}
                            <div className="form-group-std">
                                <label className="form-label-std">
                                    Fecha de la entrevista
                                </label>
                                {!modoEditar ? (
                                    <div className="input-std" style={{ background: '#f4f8fa', border: 'none' }}>
                                        {form.fecha}
                                    </div>
                                ) : (
                                    <input
                                        className={`input-std${errores.fecha ? ' error' : ''}`}
                                        type="date"
                                        value={form.fecha}
                                        onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                                        min={new Date().toISOString().slice(0, 10)}
                                    />
                                )}
                                {errores.fecha && <span className="msg-error-std">{errores.fecha}</span>}
                            </div>
                            {/* Hora */}
                            <div className="form-group-std">
                                <label className="form-label-std">
                                    Hora de la entrevista
                                </label>
                                {!modoEditar ? (
                                    <div className="input-std" style={{ background: '#f4f8fa', border: 'none' }}>
                                        {form.hora}
                                    </div>
                                ) : (
                                    <input
                                        className={`input-std${errores.hora ? ' error' : ''}`}
                                        type="time"
                                        value={form.hora}
                                        onChange={e => setForm(f => ({ ...f, hora: e.target.value }))}
                                    />
                                )}
                                {errores.hora && <span className="msg-error-std">{errores.hora}</span>}
                            </div>
                            {/* Dirección */}
                            <div className="form-group-std">
                                <label className="form-label-std">
                                    Dirección
                                    {errores.direccion && <span className="msg-error-std">{errores.direccion}</span>}
                                </label>
                                {!modoEditar ? (
                                    <div className="input-std" style={{ background: '#f4f8fa', border: 'none' }}>
                                        {form.direccion}
                                    </div>
                                ) : (
                                    <input
                                        className={`input-std${errores.direccion ? ' error' : ''}`}
                                        type="text"
                                        value={form.direccion}
                                        onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))}
                                    />
                                )}
                            </div>
                            {/* Estado dinámico */}
                            <div style={{ marginBottom: 12, color: azul, fontWeight: 600 }}>
                                {(() => {
                                    const dias = diasRestantes(combinarFechaHora(form.fecha, form.hora));
                                    if (dias > 0) return `Activo durante ${dias} días más`;
                                    if (dias === 0) return 'La entrevista es hoy';
                                    return 'Entrevista expirada';
                                })()}
                            </div>
                            {!modoEditar ? (
                                <button className="btn-save-std" onClick={() => setModoEditar(true)} style={{ marginTop: 10 }}>
                                    Editar
                                </button>
                            ) : (
                                <button className="btn-save-std" onClick={guardarCambios} disabled={guardando}>
                                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SideMenu;
