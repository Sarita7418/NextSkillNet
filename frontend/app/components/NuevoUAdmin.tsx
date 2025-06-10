'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './Formularios.css';

interface Item {
  id: number;
  descripcion: string;
}
interface EmpresaItem {
  id_empresa: number;
  nombre: string;
}

function esMayorDeEdad(fechaISO: string) {
  if (!fechaISO) return false;
  const hoy = new Date();
  const fecha = new Date(fechaISO);
  let edad = hoy.getFullYear() - fecha.getFullYear();
  const m = hoy.getMonth() - fecha.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
    edad--;
  }
  return edad >= 18;
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
    id_rol: '',
  });
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState('');

  // Validaciones visuales
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  // Campos para empresa
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [areas, setAreas] = useState<Item[]>([]);
  const [paises, setPaises] = useState<Item[]>([]);
  const [ciudades, setCiudades] = useState<Item[]>([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState('');
  const [paisSeleccionado, setPaisSeleccionado] = useState('');
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');

  // Para empresas existentes
  const [empresas, setEmpresas] = useState<EmpresaItem[]>([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const [mostrarFormularioEmpresa, setMostrarFormularioEmpresa] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/subdominios/areas')
      .then(res => res.json())
      .then((data: Item[]) => setAreas(data));
    fetch('http://127.0.0.1:8000/politicos_ubicacion/paises')
      .then(res => res.json())
      .then((data: Item[]) => setPaises(data));
    // Carga empresas solo si se selecciona el rol de representante
    if (formData.id_rol === '3') {
      fetch('http://127.0.0.1:8000/admin/empresas')
        .then(res => res.json())
        .then((data: EmpresaItem[]) => setEmpresas(data));
    }
  }, [formData.id_rol]);

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

  useEffect(() => {
    const newErrors: typeof errors = {};
    if (touched.nombre && !formData.nombre) newErrors.nombre = 'Campo obligatorio*';
    if (touched.apellido && !formData.apellido) newErrors.apellido = 'Campo obligatorio*';
    if (touched.fechaNacimiento && !formData.fechaNacimiento)
      newErrors.fechaNacimiento = 'Campo obligatorio*';
    if (
      touched.fechaNacimiento &&
      formData.fechaNacimiento &&
      !esMayorDeEdad(formData.fechaNacimiento)
    )
      newErrors.fechaNacimiento = 'Se debe tener al menos 18 años';
    if (touched.genero && !formData.genero) newErrors.genero = 'Campo obligatorio*';
    if (touched.estadoEmpleado && !formData.estadoEmpleado)
      newErrors.estadoEmpleado = 'Campo obligatorio*';
    if (touched.correo && !formData.correo) newErrors.correo = 'Campo obligatorio*';
    if (touched.id_rol && !formData.id_rol) newErrors.id_rol = 'Campo obligatorio*';
    // Validar empresa solo si elige representante
    if (formData.id_rol === '3') {
      if (touched.empresaSeleccionada && !empresaSeleccionada) newErrors.empresaSeleccionada = 'Campo obligatorio*';
      if (
        mostrarFormularioEmpresa
      ) {
        if (touched.nombreEmpresa && !nombreEmpresa) newErrors.nombreEmpresa = 'Campo obligatorio*';
        if (touched.areaSeleccionada && !areaSeleccionada) newErrors.areaSeleccionada = 'Campo obligatorio*';
        if (touched.paisSeleccionado && !paisSeleccionado) newErrors.paisSeleccionado = 'Campo obligatorio*';
        if (touched.ciudadSeleccionada && !ciudadSeleccionada) newErrors.ciudadSeleccionada = 'Campo obligatorio*';
      }
    }
    setErrors(newErrors);
  }, [
    formData, touched,
    nombreEmpresa, areaSeleccionada, paisSeleccionado, ciudadSeleccionada,
    empresaSeleccionada, mostrarFormularioEmpresa
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    // Reset empresa al cambiar rol
    if (name === 'id_rol') {
      setEmpresaSeleccionada('');
      setMostrarFormularioEmpresa(false);
      setNombreEmpresa('');
      setAreaSeleccionada('');
      setPaisSeleccionado('');
      setCiudadSeleccionada('');
    }
  };

  // Para campos empresa nueva
  const handleEmpresaChange = (setter: any, key: string) => (e: any) => {
    setter(e.target.value);
    setTouched(prev => ({ ...prev, [key]: true }));
  };

  // Selección combo empresa
  const handleEmpresaSeleccionada = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEmpresaSeleccionada(e.target.value);
    setTouched(prev => ({ ...prev, empresaSeleccionada: true }));
    if (e.target.value === 'NUEVA') {
      setMostrarFormularioEmpresa(true);
    } else {
      setMostrarFormularioEmpresa(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setTouched({
      nombre: true,
      apellido: true,
      fechaNacimiento: true,
      genero: true,
      estadoEmpleado: true,
      correo: true,
      id_rol: true,
      empresaSeleccionada: true,
      nombreEmpresa: true,
      areaSeleccionada: true,
      paisSeleccionado: true,
      ciudadSeleccionada: true
    });

    // Validar todos los campos principales
    if (
      !formData.nombre || !formData.apellido ||
      !formData.fechaNacimiento || !formData.genero || !formData.estadoEmpleado ||
      !formData.correo || !formData.id_rol
    ) {
      setError('Por favor completa todos los campos correctamente');
      return;
    }
    // Validar empresas (solo rol 3)
    if (formData.id_rol === '3') {
      if (!empresaSeleccionada) {
        setError('Debes seleccionar una empresa');
        return;
      }
      if (empresaSeleccionada === 'NUEVA') {
        if (!nombreEmpresa || !areaSeleccionada || !paisSeleccionado || !ciudadSeleccionada) {
          setError('Por favor completa todos los campos de la empresa');
          return;
        }
      }
    }
    if (!esMayorDeEdad(formData.fechaNacimiento)) {
      setError('Se debe tener al menos 18 años');
      return;
    }
    if (contraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      // Registrar usuario
      const response = await fetch('http://127.0.0.1:8000/admin/anadir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          fechaNacimiento: formData.fechaNacimiento,
          genero: formData.genero,
          estadoEmpleado: formData.estadoEmpleado,
          correo: formData.correo,
          contraseña,
          id_rol: parseInt(formData.id_rol, 10)
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

      // Si representante y empresa seleccionada (no nueva)
      if (formData.id_rol === '3') {
        if (empresaSeleccionada !== 'NUEVA') {
          await fetch('http://127.0.0.1:8000/usuario/registrar_empresa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id_persona: nuevaPersonaId,
              nombre_empresa: `idEmpresa=${empresaSeleccionada}`,
              id_area: 1,
              id_ciudad: 1
            })
          });
        } else {
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
      }
      alert('Usuario registrado con éxito');
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    }
  };

  return (
    <div className="form-container-std">
      <h2 className="titulo">Añadir Usuario</h2>
      <div className="form-card-std">
        {/* Nombre */}
        <div className="form-group-std">
          <label className="form-label-std">
            Nombre
            {errors.nombre && <span className="msg-error-std">{errors.nombre}</span>}
          </label>
          <input
            className={`input-std${errors.nombre ? ' error' : ''}`}
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder='Ingrese su nombre'
            onBlur={() => setTouched(prev => ({ ...prev, nombre: true }))}
            autoComplete="off"
          />
        </div>
        {/* Apellido */}
        <div className="form-group-std">
          <label className="form-label-std">
            Apellido
            {errors.apellido && <span className="msg-error-std">{errors.apellido}</span>}
          </label>
          <input
            className={`input-std${errors.apellido ? ' error' : ''}`}
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            placeholder='Ingrese su apellido'
            onBlur={() => setTouched(prev => ({ ...prev, apellido: true }))}
            autoComplete="off"
          />
        </div>
        {/* Correo */}
        <div className="form-group-std">
          <label className="form-label-std">
            Correo electrónico
            {errors.correo && <span className="msg-error-std">{errors.correo}</span>}
          </label>
          <input
            className={`input-std${errors.correo ? ' error' : ''}`}
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            placeholder='Ingrese su correo electrónico'
            onBlur={() => setTouched(prev => ({ ...prev, correo: true }))}
            autoComplete="off"
          />
        </div>
        {/* Fecha nacimiento */}
        <div className="form-group-std">
          <label className="form-label-std">
            Fecha de Nacimiento
            {errors.fechaNacimiento && <span className="msg-error-std">{errors.fechaNacimiento}</span>}
          </label>
          <input
            className={`input-std${errors.fechaNacimiento ? ' error' : ''}`}
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
            onBlur={() => setTouched(prev => ({ ...prev, fechaNacimiento: true }))}
          />
        </div>
        {/* Género */}
        <div className="form-group-std">
          <label className="form-label-std">
            Género
            {errors.genero && <span className="msg-error-std">{errors.genero}</span>}
          </label>
          <select
            className={`select-std${errors.genero ? ' error' : ''}`}
            name="genero"
            value={formData.genero}
            onChange={handleInputChange}
            onBlur={() => setTouched(prev => ({ ...prev, genero: true }))}
          >
            <option value="">Seleccione género</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>
        {/* Situación laboral */}
        <div className="form-group-std">
          <label className="form-label-std">
            Situación Laboral
            {errors.estadoEmpleado && <span className="msg-error-std">{errors.estadoEmpleado}</span>}
          </label>
          <select
            className={`select-std${errors.estadoEmpleado ? ' error' : ''}`}
            name="estadoEmpleado"
            value={formData.estadoEmpleado}
            onChange={handleInputChange}
            onBlur={() => setTouched(prev => ({ ...prev, estadoEmpleado: true }))}
          >
            <option value="">Seleccione su situación laboral</option>
            <option value="1">Con trabajo</option>
            <option value="0">Sin trabajo</option>
          </select>
        </div>
        {/* Rol */}
        <div className="form-group-std">
          <label className="form-label-std">
            Rol
            {errors.id_rol && <span className="msg-error-std">{errors.id_rol}</span>}
          </label>
          <select
            className={`select-std${errors.id_rol ? ' error' : ''}`}
            name="id_rol"
            value={formData.id_rol}
            onChange={handleInputChange}
            onBlur={() => setTouched(prev => ({ ...prev, id_rol: true }))}
          >
            <option value="">Seleccione un rol</option>
            <option value="2">Administrador</option>
            <option value="1">Postulante</option>
            <option value="3">Representante Empresa</option>
          </select>
        </div>

        {/* Combo de empresas SOLO si rol es representante */}
        {formData.id_rol === '3' && (
          <div className="form-group-std">
            <label className="form-label-std">
              ¿La empresa ya está registrada?
              {errors.empresaSeleccionada && <span className="msg-error-std">{errors.empresaSeleccionada}</span>}
            </label>
            <select
              className={`select-std${errors.empresaSeleccionada ? ' error' : ''}`}
              value={empresaSeleccionada}
              onChange={handleEmpresaSeleccionada}
              onBlur={() => setTouched(prev => ({ ...prev, empresaSeleccionada: true }))}
            >
              <option value="">Seleccione una opción</option>
              {empresas.map(emp => (
                <option key={emp.id_empresa} value={emp.id_empresa}>
                  {emp.nombre}
                </option>
              ))}
              <option value="NUEVA">LA EMPRESA NO ESTÁ EN EL LISTADO</option>
            </select>
          </div>
        )}

        {/* Formulario para empresa nueva solo si escoge NUEVA */}
        {formData.id_rol === '3' && mostrarFormularioEmpresa && (
          <>
            <div className="form-group-std">
              <label className="form-label-std">
                Nombre empresa
                {errors.nombreEmpresa && <span className="msg-error-std">{errors.nombreEmpresa}</span>}
              </label>
              <input
                className={`input-std${errors.nombreEmpresa ? ' error' : ''}`}
                type="text"
                value={nombreEmpresa}
                onChange={handleEmpresaChange(setNombreEmpresa, 'nombreEmpresa')}
                onBlur={() => setTouched(prev => ({ ...prev, nombreEmpresa: true }))}
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
                onChange={handleEmpresaChange(setAreaSeleccionada, 'areaSeleccionada')}
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
                País
                {errors.paisSeleccionado && <span className="msg-error-std">{errors.paisSeleccionado}</span>}
              </label>
              <select
                className={`select-std${errors.paisSeleccionado ? ' error' : ''}`}
                value={paisSeleccionado}
                onChange={handleEmpresaChange(setPaisSeleccionado, 'paisSeleccionado')}
                onBlur={() => setTouched(prev => ({ ...prev, paisSeleccionado: true }))}
              >
                <option value="">Seleccione un país</option>
                {paises.map(pais => (
                  <option key={pais.id} value={pais.id}>
                    {pais.descripcion}
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
                onChange={handleEmpresaChange(setCiudadSeleccionada, 'ciudadSeleccionada')}
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
          </>
        )}
        {/* Contraseña */}
        <div className="form-group-std">
          <label className="form-label-std">Contraseña</label>
          <div className="password-field-std">
            <input
              className="input-std"
              type={showPassword1 ? "text" : "password"}
              value={contraseña}
              onChange={e => setContraseña(e.target.value)}
              placeholder="introducir contraseña"
              autoComplete="new-password"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="password-toggle-std"
              onClick={() => setShowPassword1(!showPassword1)}
              aria-label={showPassword1 ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
            >
              {showPassword1 ? "👁️" : "🙈"}
            </button>
          </div>
        </div>
        {/* Confirmar contraseña */}
        <div className="form-group-std">
          <label className="form-label-std">Confirmar contraseña</label>
          <div className="password-field-std">
            <input
              className="input-std"
              type={showPassword2 ? "text" : "password"}
              value={confirmarContraseña}
              onChange={e => setConfirmarContraseña(e.target.value)}
              placeholder="confirmar contraseña"
              autoComplete="new-password"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="password-toggle-std"
              onClick={() => setShowPassword2(!showPassword2)}
              aria-label={showPassword2 ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
            >
              {showPassword2 ? "👁️" : "🙈"}
            </button>
          </div>
        </div>
        {/* Error general */}
        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
        <button
          className="btn-save-std"
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
