'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './organism/RegisterForm.css';

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

const EmpresasForm: React.FC<EmpresaFormProps> = ({ id_empresa, nombreInicial, areaInicial, ciudadInicial }) => {
  const router = useRouter();

  const [nombre, setNombre] = useState(nombreInicial || '');
  const [areas, setAreas] = useState<Item[]>([]);
  const [ciudades, setCiudades] = useState<Item[]>([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState(areaInicial ? areaInicial.toString() : '');
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(ciudadInicial ? ciudadInicial.toString() : '');

  // Representantes
  const [showAddRep, setShowAddRep] = useState(false);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string>('');

  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/subdominios/areas')
      .then(res => res.json())
      .then((data: Item[]) => setAreas(data));
    fetch('http://127.0.0.1:8000/politicos_ubicacion/ciudades/2')
      .then(res => res.json())
      .then((data: Item[]) => setCiudades(data));
  }, []);

  useEffect(() => {
    if (showAddRep) {
      fetch('http://127.0.0.1:8000/admin/usuarios')
        .then(res => res.json())
        .then((data: User[]) => setUsuarios(data));
    }
  }, [showAddRep]);

  const handleSubmit = async () => {
    setError('');

    if (!nombre || !areaSeleccionada || !ciudadSeleccionada) {
      setError('Completa todos los campos');
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

  return (
    <div className="register-container">
      <div className="form-container">
        <div className="form-field">
          <label>Nombre empresa</label>
          <input
            className="input"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Nombre de la empresa"
          />
        </div>
        <div className="form-field">
          <label>Área</label>
          <select
            className="input"
            value={areaSeleccionada}
            onChange={e => setAreaSeleccionada(e.target.value)}
          >
            <option value="">Seleccione un área</option>
            {areas.map(area => (
              <option key={area.id} value={area.id}>
                {area.descripcion}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Ciudad</label>
          <select
            className="input"
            value={ciudadSeleccionada}
            onChange={e => setCiudadSeleccionada(e.target.value)}
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
          className="create-button"
          style={{ margin: '10px 0', width: '100%' }}
          onClick={() => setShowAddRep(true)}
          disabled={showAddRep}
        >
          Añadir representante
        </button>

        {showAddRep && (
          <div className="form-field">
            <label>Selecciona representante</label>
            <select
              className="input"
              value={usuarioSeleccionado}
              onChange={e => setUsuarioSeleccionado(e.target.value)}
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

        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}

        <button
          className="create-button"
          type="button"
          onClick={handleSubmit}
          style={{ marginRight: '10px' }}
        >
          Confirmar
        </button>
        <button
          type="button"
          className="create-button"
          style={{ background: 'gray' }}
          onClick={() => router.back()}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default EmpresasForm;
