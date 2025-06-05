'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './organism/RegisterForm.css';

interface Item {
  id: number;
  descripcion: string;
}

const RegistroFormularioA: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    genero: '',
    estadoEmpleado: '',
    correo: '',
    id_rol: '', // <-- CAMBIA A id_rol
  });
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState('');

  // Campos para empresa
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [areas, setAreas] = useState<Item[]>([]);
  const [paises, setPaises] = useState<Item[]>([]);
  const [ciudades, setCiudades] = useState<Item[]>([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState('');
  const [paisSeleccionado, setPaisSeleccionado] = useState('');
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/subdominios/areas')
      .then(res => res.json())
      .then((data: Item[]) => setAreas(data));
    fetch('http://127.0.0.1:8000/politicos_ubicacion/paises')
      .then(res => res.json())
      .then((data: Item[]) => setPaises(data));
  }, []);

  useEffect(() => {
    if (!paisSeleccionado) {
      setCiudades([]);
      setCiudadSeleccionada('');
      return;
    }
    fetch(`http://127.0.0.1:8000/politicos_ubicacion/ciudades/${paisSeleccionado}`)
      .then(res => res.json())
      .then((data: Item[]) => setCiudades(data));
  }, [paisSeleccionado]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    const { nombre, apellido, fechaNacimiento, genero, estadoEmpleado, correo, id_rol } = formData;

    if (contraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!nombre || !apellido || !fechaNacimiento || !genero || !estadoEmpleado || !correo || !id_rol) {
      setError('Por favor completa todos los campos');
      return;
    }
    if (id_rol === '3' && (!nombreEmpresa || !areaSeleccionada || !paisSeleccionado || !ciudadSeleccionada)) {
      setError('Completa todos los campos de empresa');
      return;
    }

    try {
      // 1. Registrar usuario
      const response = await fetch('http://127.0.0.1:8000/admin/anadir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido,
          fechaNacimiento,
          genero,
          estadoEmpleado,
          correo,
          contraseña,
          id_rol: parseInt(id_rol, 10)
        })
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Error al registrar');
        return;
      }
      const nuevaPersonaId = data.id_persona;
      if (nuevaPersonaId) {
        localStorage.setItem('authstore', JSON.stringify({ id_persona: nuevaPersonaId }));
      }

      // 2. Si es representante_empresa (id_rol === '3'), registrar empresa
      if (id_rol === '3') {
        await fetch('http://127.0.0.1:8000/usuario/registrar_empresa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_persona: nuevaPersonaId,
            nombre_empresa: nombreEmpresa,
            id_area: parseInt(areaSeleccionada, 10),
            id_ciudad: parseInt(ciudadSeleccionada, 10)
          })
        });
      }

      alert('Usuario registrado con éxito');
      router.push('/Login');
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <div className="form-field">
          <label>Nombre</label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Jhovanni"
          />
        </div>
        <div className="form-field">
          <label>Apellido</label>
          <input
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            placeholder="Gutiérrez"
          />
        </div>
        <div className="form-field">
          <label>Correo electrónico</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            placeholder="tucorreo@ejemplo.com"
          />
        </div>
        <div className="form-field">
          <label>Fecha de Nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-field">
          <label>Género</label>
          <select
            name="genero"
            value={formData.genero}
            onChange={handleInputChange}
          >
            <option value="">Seleccione género</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>
        <div className="form-field">
          <label>Situación Laboral</label>
          <select
            name="estadoEmpleado"
            value={formData.estadoEmpleado}
            onChange={handleInputChange}
          >
            <option value="">Seleccione su situación laboral</option>
            <option value="1">Con trabajo</option>
            <option value="0">Sin trabajo</option>
          </select>
        </div>
        <div className="form-field">
          <label>Rol</label>
          <select
            name="id_rol"
            value={formData.id_rol}
            onChange={handleInputChange}
          >
            <option value="">Seleccione un rol</option>
            <option value="2">Administrador</option>
            <option value="1">Postulante</option>
            <option value="3">Representante Empresa</option>
          </select>
        </div>
        {/* Campos de empresa solo si selecciona "Representante Empresa" */}
        {formData.id_rol === '3' && (
          <>
            <div className="form-field">
              <label>Nombre empresa</label>
              <input
                type="text"
                value={nombreEmpresa}
                onChange={e => setNombreEmpresa(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Área</label>
              <select value={areaSeleccionada} onChange={e => setAreaSeleccionada(e.target.value)}>
                <option value="">Seleccione un área</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>
                    {area.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>País</label>
              <select value={paisSeleccionado} onChange={e => setPaisSeleccionado(e.target.value)}>
                <option value="">Seleccione un país</option>
                {paises.map(pais => (
                  <option key={pais.id} value={pais.id}>
                    {pais.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Ciudad</label>
              <select value={ciudadSeleccionada} onChange={e => setCiudadSeleccionada(e.target.value)}>
                <option value="">Seleccione una ciudad</option>
                {ciudades.map(ciudad => (
                  <option key={ciudad.id} value={ciudad.id}>
                    {ciudad.descripcion}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        <div className="form-field">
          <label>Contraseña</label>
          <div className="password-field">
            <input
              type={showPassword1 ? "text" : "password"}
              value={contraseña}
              onChange={e => setContraseña(e.target.value)}
              placeholder="********"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword1(!showPassword1)}
              aria-label={showPassword1 ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword1 ? "👁️" : "🙈"}
            </button>
          </div>
        </div>
        <div className="form-field">
          <label>Confirmar contraseña</label>
          <div className="password-field">
            <input
              type={showPassword2 ? "text" : "password"}
              value={confirmarContraseña}
              onChange={e => setConfirmarContraseña(e.target.value)}
              placeholder="********"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword2(!showPassword2)}
              aria-label={showPassword2 ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword2 ? "👁️" : "🙈"}
            </button>
          </div>
        </div>
        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
        <button
          className="create-button"
          type="button"
          onClick={handleSubmit}
        >
          Crear cuenta
        </button>
      </div>
    </div>
  );
};

export default RegistroFormularioA;
