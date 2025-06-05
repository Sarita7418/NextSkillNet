"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './RegisterForm.css';
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
    correo: ''
  });
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError('');

    // 1. Validar que las contraseñas coincidan
    if (contraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // 2. Validar campos obligatorios
    const { nombre, apellido, fechaNacimiento, genero, estadoEmpleado, correo } = formData;
    if (!nombre || !apellido || !fechaNacimiento || !genero || !estadoEmpleado || !correo) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      // 3. Llamada al endpoint /register
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre,
          apellido,
          fechaNacimiento,
          genero,
          estadoEmpleado,
          correo,
          contraseña
        })
      });

      const data = await response.json();

      if (response.ok) {
        // 4. Si el registro fue exitoso, Laravel regresa algo así: { message: "Registro exitoso", id_persona: 42 }
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
        // 6. Si Laravel devolvió un error
        alert(data.message || 'Error al registrar');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <h2 className="form-title">¡Llena el formulario para formar parte de nosotros!</h2>

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
          <label>Contraseña</label>
          <div className="password-field">
            <input
              type={showPassword1 ? "text" : "password"}
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
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
              onChange={(e) => setConfirmarContraseña(e.target.value)}
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

      <Image src={bienvenida} alt="Bienvenida" width={500} height={500} />
    </div>
  );
};

export default RegisterForm;
