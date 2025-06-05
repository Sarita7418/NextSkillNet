'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Item {
  id: number;
  descripcion: string;
}
interface User {
  id_usuario: string;
  nombre: string;
  apellido: string;
}

interface EmpresaFormProps {
  id_empresa: string;
  nombreInicial: string;
  areaInicial: string;
  ciudadInicial: string;
}

const EmpresasForm: React.FC<EmpresaFormProps> = ({
  id_empresa, nombreInicial, areaInicial, ciudadInicial
}) => {
  const router = useRouter();

  // Estados
  const [nombre, setNombre] = useState(nombreInicial || '');
  const [areas, setAreas] = useState<Item[]>([]);
  const [ciudades, setCiudades] = useState<Item[]>([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState(areaInicial ? areaInicial.toString() : '');
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(ciudadInicial ? ciudadInicial.toString() : '');
  const [showAddRep, setShowAddRep] = useState(false);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string>('');
  const [error, setError] = useState('');

  // Validación visual
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  // Cargar áreas y ciudades al montar
  useEffect(() => {
    fetch('http://127.0.0.1:8000/subdominios/areas')
      .then(res => res.json())
      .then((data: Item[]) => setAreas(data));
    fetch('http://127.0.0.1:8000/politicos_ubicacion/ciudades/2')
      .then(res => res.json())
      .then((data: Item[]) => setCiudades(data));
  }, []);

  // Cargar usuarios solo si añade representante
  useEffect(() => {
    if (showAddRep) {
      fetch('http://127.0.0.1:8000/admin/usuarios')
        .then(res => res.json())
        .then((data: User[]) => setUsuarios(data));
    }
  }, [showAddRep]);

  // Validaciones al vuelo
  useEffect(() => {
    const newErrors: typeof errors = {};
    if (touched.nombre && !nombre) newErrors.nombre = 'Campo obligatorio*';
    if (touched.areaSeleccionada && !areaSeleccionada) newErrors.areaSeleccionada = 'Campo obligatorio*';
    if (touched.ciudadSeleccionada && !ciudadSeleccionada) newErrors.ciudadSeleccionada = 'Campo obligatorio*';
    if (showAddRep && touched.usuarioSeleccionado && !usuarioSeleccionado) newErrors.usuarioSeleccionado = 'Campo obligatorio*';
    setErrors(newErrors);
  }, [nombre, areaSeleccionada, ciudadSeleccionada, usuarioSeleccionado, touched, showAddRep]);

  // Handlers
  const handleSubmit = async () => {
    setTouched({
      nombre: true,
      areaSeleccionada: true,
      ciudadSeleccionada: true,
      usuarioSeleccionado: showAddRep,
    });

    if (
      !nombre ||
      !areaSeleccionada ||
      !ciudadSeleccionada ||
      (showAddRep && !usuarioSeleccionado)
    ) {
      setError('Completa todos los campos obligatorios');
      return;
    }

    try {
      const body: any = {
        id_empresa,
        nombre,
        id_area: parseInt(areaSeleccionada, 10),
        id_ciudad: parseInt(ciudadSeleccionada, 10),
      };

      if (showAddRep && usuarioSeleccionado) {
        body.id_persona = parseInt(usuarioSeleccionado, 10);
      }

      const res = await fetch('http://127.0.0.1:8000/admin/empresa/actualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error al actualizar');
        return;
      }

      alert(data.message || 'Empresa actualizada');
      router.push('/Administracion');
    } catch (err) {
      setError('Error de conexión');
      console.error(err);
    }
  };

  // RENDER
  return (
    <div className="form-container-std">
      <div className="form-card-std">
        <div className="form-group-std">
          <label className="form-label-std">
            Nombre empresa
            {errors.nombre && <span className="msg-error-std">{errors.nombre}</span>}
          </label>
          <input
            className={`input-std${errors.nombre ? ' error' : ''}`}
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Nombre de la empresa"
            onBlur={() => setTouched(prev => ({ ...prev, nombre: true }))}
            autoComplete="off"
          />
        </div>
        <div className="form-group-std">
          <label className="form-label-std">
            Área
            {errors.areaSeleccionada && <span className="msg-error-std">{errors.areaSeleccionada}</span>}
          </label>
          <select
            className={`select-std${errors.areaSeleccionada ? ' error' : ''}`}
            value={areaSeleccionada}
            onChange={e => setAreaSeleccionada(e.target.value)}
            onBlur={() => setTouched(prev => ({ ...prev, areaSeleccionada: true }))}
          >
            <option value="">Seleccione un área</option>
            {areas.map(area => (
              <option key={area.id} value={area.id}>
                {area.descripcion}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group-std">
          <label className="form-label-std">
            Ciudad
            {errors.ciudadSeleccionada && <span className="msg-error-std">{errors.ciudadSeleccionada}</span>}
          </label>
          <select
            className={`select-std${errors.ciudadSeleccionada ? ' error' : ''}`}
            value={ciudadSeleccionada}
            onChange={e => setCiudadSeleccionada(e.target.value)}
            onBlur={() => setTouched(prev => ({ ...prev, ciudadSeleccionada: true }))}
          >
            <option value="">Seleccione una ciudad</option>
            {ciudades.map(ciudad => (
              <option key={ciudad.id} value={ciudad.id}>
                {ciudad.descripcion}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="btn-save-std"
          style={{ margin: '0', width: '100%' }}
          onClick={() => setShowAddRep(true)}
          disabled={showAddRep}
        >
          Añadir representante
        </button>

        {showAddRep && (
          <div className="form-group-std">
            <label className="form-label-std" style={{ marginTop: '10px' }}>
              Selecciona representante
              {errors.usuarioSeleccionado && <span className="msg-error-std">{errors.usuarioSeleccionado}</span>}
            </label>
            <select
              className={`select-std${errors.usuarioSeleccionado ? ' error' : ''}`}
              value={usuarioSeleccionado}
              onChange={e => setUsuarioSeleccionado(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, usuarioSeleccionado: true }))}
            >
              <option value="">Selecciona una persona</option>
              {usuarios.map(u => (
                <option key={u.id_usuario} value={u.id_usuario}>
                  {u.nombre} {u.apellido}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && <p style={{ color: '#e11d48', marginTop: '0.5rem' }}>{error}</p>}

        <button
          className="btn-save-std"
          type="button"
          onClick={handleSubmit}
          style={{ marginRight: '10px' }}
        >
          Confirmar
        </button>
        <button
          type="button"
          className="btn-save-std"
          style={{ background: 'gray' }}
          onClick={() => router.push('/Administracion')}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default EmpresasForm;
