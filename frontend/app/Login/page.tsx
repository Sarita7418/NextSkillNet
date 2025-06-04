'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import Footer from '../components/organism/Footer';
import Header from '../components/organism/Header';

export default function LoginPage() {
  const [nombre, setNombre] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true); // Activar loading
    setError(''); // Limpiar error previo

    try {
      console.log('Nombre:', nombre);
      console.log('Contraseña:', contraseña);
      // Hacer la solicitud de login
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          contrasena: contraseña, // ojo aquí, contrasena sin tilde
        }),
      });

      // Verificar si la respuesta es exitosa
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        alert('Login exitoso!');
        window.location.href = '/PerfilUsuario';
      } else {
        // Si hubo un error, mostrar mensaje con alert
        alert('Credenciales incorrectas!');
      }
    } catch (error) {
      setError('Hubo un problema al conectar con el servidor');
      alert('Error al conectar con el servidor!');
    } finally {
      setIsLoading(false); // Desactivar loading
    }
  };

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.card}>
          <h1>Bienvenido/a a Skillnet</h1>


          <input
            className={styles.inputField}
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={handleNombreChange}
          />
          <input
            className={styles.inputField}
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={handleContraseñaChange}
          />

          <p className={styles.forgot}>¿Olvidó su contraseña?</p>
          <label className={styles.stayLogged}>
            <input type="checkbox" />
            Mantenerme conectado
          </label>

          {/* Mostrar mensaje de error si existe */}
          {error && <p className={styles.errorMessage}>{error}</p>}

          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isLoading} // Deshabilitar botón mientras carga
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
