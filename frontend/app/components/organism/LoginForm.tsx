"use client";

import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import bienvenida from '../../../public/image 389.svg';
import Image from 'next/image';

const LoginForm: React.FC = () => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [registerData, setRegisterData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('registerData');
    if (storedData) {
      setRegisterData(JSON.parse(storedData));
    }
  }, []);

  const handleSubmit = async () => {
    if (!registerData) {
      alert('Datos de registro no encontrados. Por favor vuelva a registrarse.');
      return;
    }

    // Validación básica de campos esenciales
    const { nombre, apellido, fechaNacimiento, genero, estadoEmpleado, correo } = registerData;
    if (!nombre || !apellido || !fechaNacimiento || !genero || !estadoEmpleado || !correo) {
      alert('Datos incompletos en el registro. Por favor vuelva a registrarse.');
      return;
    }

    if (contraseña !== confirmarContraseña) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const finalData = {
      nombre,
      apellido,
      fecha_nacimiento: fechaNacimiento,
      genero,
      estado_empleado: estadoEmpleado, // ✅ Corrección aquí
      correo,
      contraseña
    };

    try {
      setIsSubmitting(true);
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(finalData)
      });

      if (response.ok) {
        const data = await response.json();
        alert('Usuario registrado exitosamente!');
        localStorage.removeItem('registerData');
        window.location.href = '/Inicio'; // Cambia según tu ruta
      } else {
        alert('Error en el registro. Verifica los datos o intenta más tarde.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <div className="login-form">
          <div className="form-field">
            <label>Contraseña</label>
            <div className="password-field">
              <input 
                type={showPassword1 ? "text" : "password"}
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
              />
              <button 
                className="password-toggle" 
                type="button"
                onClick={() => setShowPassword1(!showPassword1)}
              >
                {showPassword1 ? "○" : "⦿"}
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
              />
              <button 
                className="password-toggle" 
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? "○" : "⦿"}
              </button>
            </div>
          </div>

          <button 
            className="create-button" 
            type="button" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </div>
      </div>

      <Image src={bienvenida} alt="Bienvenida" width={500} height={500} />
    </div>
  );
};

export default LoginForm;
