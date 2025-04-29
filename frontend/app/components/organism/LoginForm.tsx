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

    if (contraseña !== confirmarContraseña) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const finalData = {
      nombre: registerData.nombre,
      apellido: registerData.apellido,
      fecha_nacimiento: registerData.fechaNacimiento,
      genero: registerData.genero,
      estado_civil: registerData.estadoCivil,
      correo: registerData.correo,
      contraseña: contraseña
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/register', { // Cambia si tu endpoint es diferente
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
        // Redireccionar a la página de inicio o a otra página
        window.location.href = '/Inicio'; // Cambia esto según tu ruta
      } else {
        alert('Error en el registro.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión.');
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

          {/* Botón para crear la cuenta */}
          <button className="create-button" type="button" onClick={handleSubmit}>
            Crear cuenta
          </button>
          
        </div>
      </div>

      <Image src={bienvenida} alt="Bienvenida" width={500} height={500} />

    </div>
  );
};

export default LoginForm;
