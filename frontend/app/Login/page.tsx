'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from '../components/organism/Footer';
import HeaderMain from '../components/organism/HeaderMain';
import styles from './page.module.css'; // Puedes seguir usando tu CSS local

export default function LoginPage() {
  const [nombre, setNombre] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Manejadores para actualizar el estado de los inputs
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
  };

  const handleContraseñaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContraseña(e.target.value);
  };

  // Función para manejar el submit del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          contrasena: contraseña,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        alert('Login exitoso!');
        window.location.href = '/Inicio';
      } else {
        alert('Credenciales incorrectas!');
      }
    } catch (error) {
      setError('Hubo un problema al conectar con el servidor');
      alert('Error al conectar con el servidor!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <HeaderMain />

      <main className={styles.main}>
        <div className={styles.card}>
          <h1>Bienvenido/a a Skillnet</h1>

          <input
            className={styles.inputField}
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={handleNombreChange}
            autoComplete="username"
          />

          {/* Campo de contraseña con mostrar/ocultar */}
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              className={styles.inputField}
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={contraseña}
              onChange={handleContraseñaChange}
              autoComplete="current-password"
              style={{ paddingRight: '42px' }}
            />
            <button
              type="button"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '22px',
                color: '#22223b',
                padding: 0,
                lineHeight: 1,
              }}
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
          <span className={styles.separator}>O</span>
          <button
            className={styles.googleButton}
            onClick={() => window.location.href = '/nuevoUsuario'}
          >
            Crear una cuenta
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
