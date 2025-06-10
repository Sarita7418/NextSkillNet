"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../Formularios.css'; // solo tu CSS global aquí
import bienvenida from '../../../public/image 389.svg';
import Image from 'next/image';

const RegisterForm: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    genero: '',
    estadoEmpleado: '',
    correo: '',
    telefono: '', // <-- AÑADIDO
    disponibilidad: '', // <-- AÑADIDO
  });
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [error, setError] = useState('');

  // Validaciones visuales individuales
  const errors = {
    nombre: touched.nombre && !formData.nombre ? 'Campo obligatorio*' : '',
    apellido: touched.apellido && !formData.apellido ? 'Campo obligatorio*' : '',
    correo: touched.correo && !formData.correo ? 'Campo obligatorio*' : '',
    fechaNacimiento:
      touched.fechaNacimiento && !formData.fechaNacimiento
        ? 'Campo obligatorio*'
        : touched.fechaNacimiento && !mayorDe18(formData.fechaNacimiento)
          ? 'Se debe tener al menos 18 años'
          : '',
    genero: touched.genero && !formData.genero ? 'Campo obligatorio*' : '',
    estadoEmpleado: touched.estadoEmpleado && !formData.estadoEmpleado ? 'Campo obligatorio*' : '',
    contraseña: touched.contraseña && !contraseña ? 'Campo obligatorio*' : '',
    confirmarContraseña: touched.confirmarContraseña && !confirmarContraseña ? 'Campo obligatorio*' : '',
  };

  // Validar si la fecha corresponde a alguien de 18 años o más
  function mayorDe18(fecha: string) {
    if (!fecha) return false;
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    const edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) return edad - 1 >= 18;
    return edad >= 18;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async () => {
    setTouched({
      nombre: true,
      apellido: true,
      correo: true,
      fechaNacimiento: true,
      genero: true,
      estadoEmpleado: true,
      contraseña: true,
      confirmarContraseña: true,
      telefono: true, // AÑADIDO: Marcar el campo de teléfono como tocado
      disponibilidad: true, // AÑADIDO: Marcar el campo de disponibilidad como tocado
    });
    setError('');

    // Validaciones visuales antes de enviar
    if (
      !formData.nombre || !formData.apellido || !formData.fechaNacimiento ||
      !formData.genero || !formData.estadoEmpleado || !formData.correo ||
      !contraseña || !confirmarContraseña
    ) {
      setError('Completa todos los campos obligatorios');
      return;
    }
    if (!mayorDe18(formData.fechaNacimiento)) {
      setError('Debes tener al menos 18 años');
      return;
    }
    if (contraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          contraseña,
        })
      });

      const data = await response.json();

      if (response.ok) {
        const nuevaPersonaId = data.id_persona;
        if (nuevaPersonaId) {
          localStorage.setItem(
            'authstore',
            JSON.stringify({ id_persona: nuevaPersonaId })
          );
        }
        alert('Usuario registrado con éxito');
        router.push('/Login');
      } else {
        alert(data.message || 'Error al registrar');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="form-container-std">
      <div className="form-card-std">
        <h2 className="form-title" style={{ textAlign: 'center', color: '#143D8D', fontWeight: 700 , fontSize:30}}>¡Llena el formulario para formar parte de nosotros!</h2>
        
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
            onBlur={() => handleBlur('nombre')}
            placeholder="Introduce tu nombre"
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
            onBlur={() => handleBlur('apellido')}
            placeholder="Introduce tu apellido"
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
            onBlur={() => handleBlur('correo')}
            placeholder="Introduce tu correo electrónico"
            autoComplete="off"
          />
        </div>
        {/* AÑADIDO: Campo de Teléfono */}
        <div className="form-group-std">
          <label className="form-label-std">Teléfono (Opcional)</label>
          <input
            className="input-std"
            name="telefono"
            type="tel"
            value={formData.telefono}
            onChange={handleInputChange}
            placeholder="Introduce tu número de teléfono"
            autoComplete="off"
          />
        </div>
        {/* Fecha de Nacimiento */}
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
            onBlur={() => handleBlur('fechaNacimiento')}
            autoComplete="off"
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
            onBlur={() => handleBlur('genero')}
          >
            <option value="">Seleccione género</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>
        {/* Situación Laboral */}
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
            onBlur={() => handleBlur('estadoEmpleado')}
          >
            <option value="">Seleccione su situación laboral</option>
            <option value="1">Con trabajo</option>
            <option value="0">Sin trabajo</option>
          </select>
        </div>
        {/* AÑADIDO: Campo de Disponibilidad */}
        <div className="form-group-std">
          <label className="form-label-std">Disponibilidad (Opcional)</label>
          <select
            className="select-std"
            name="disponibilidad"
            value={formData.disponibilidad}
            onChange={handleInputChange}
          >
            <option value="">No especificar</option>
            <option value="immediate">Inmediata</option>
            <option value="two-weeks">Dos semanas</option>
            <option value="one-month">Un mes</option>
          </select>
        </div>
        {/* Contraseña */}
        <div className="form-group-std">
          <label className="form-label-std">
            Contraseña
            {errors.contraseña && <span className="msg-error-std">{errors.contraseña}</span>}
          </label>
          <div className="password-field-std">
            <input
              className={`input-std${errors.contraseña ? ' error' : ''}`}
              type={showPassword1 ? "text" : "password"}
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              onBlur={() => handleBlur('contraseña')}
              placeholder="Introduce tu contraseña"
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
          <label className="form-label-std">
            Confirmar contraseña
            {errors.confirmarContraseña && <span className="msg-error-std">{errors.confirmarContraseña}</span>}
          </label>
          <div className="password-field-std">
            <input
              className={`input-std${errors.confirmarContraseña ? ' error' : ''}`}
              type={showPassword2 ? "text" : "password"}
              value={confirmarContraseña}
              onChange={(e) => setConfirmarContraseña(e.target.value)}
              onBlur={() => handleBlur('confirmarContraseña')}
              placeholder="Confirma tu contraseña"
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

        {/* Mensaje de error general */}
        {error && <p className="msg-error-std" style={{ margin: '6px 0', textAlign: 'center' }}>{error}</p>}

        <button
          className="btn-save-std"
          type="button"
          onClick={handleSubmit}
        >
          Crear cuenta
        </button>
      </div>{ /* Imagen de bienvenida 
      <Image src={bienvenida} alt="Bienvenida" width={500} height={500} />*/
      }
      
    </div>
  );
};

export default RegisterForm;
