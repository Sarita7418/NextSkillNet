// src/components/pages/LoginForm.tsx
"use client";

import React, { useState } from 'react';
import './LoginForm.css';
import bienvenida from '../../../public/image 389.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const LoginForm: React.FC = () => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [nombre, setNombre] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setError('');

    if (!nombre || !contraseña) {
      setError('Por favor, ingrese su nombre de usuario y contraseña.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nombre: nombre,
          contrasena: contraseña
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('id_persona', data.usuario.id_usuario);
        alert('Inicio de sesión exitoso!');
        router.push('/Inicio');
      } else {
        setError(data.message || 'Credenciales incorrectas. Intente nuevamente.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <div className="login-form">
          <div className="form-field">
            <label>Nombre de usuario</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
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

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button
            className="create-button"
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </div>
      </div>

      <Image src={bienvenida} alt="Bienvenida" width={500} height={500} />
    </div>
  );
};

export default LoginForm;