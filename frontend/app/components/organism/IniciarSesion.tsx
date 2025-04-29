'use client';

import Image from 'next/image';
import styles from './IniciarSesion.module.css';
 
import Link from 'next/link';

export default function IniciarSesion() {
  return (
    <div className={styles.container}>
     <div className={styles.card}>
          <h1>INICIAR SESIÓN</h1>
          <Link href="/frame197">
          <button className={styles.googleButton}>
            Iniciar con Google
          </button>
          </Link>
          <Link href={""}>
          <button className={styles.appleButton}>
            Iniciar con Apple
          </button>
          </Link>
          <span className={styles.separator}>O</span>

          <input
            className={styles.inputField}
            type="text"
            placeholder="Correo electrónico o teléfono"
          />
          <input
            className={styles.inputField}
            type="password"
            placeholder="Contraseña"
          />

          <p className={styles.forgot}>¿Olvidó su contraseña?</p>
          <label className={styles.stayLogged}>
            <input type="checkbox" />
            Mantenerme conectado
          </label>

          {/* Aquí el botón envuelto en Link */}
          <Link href="/Institucional">
            <button className={styles.submitButton}>
              Iniciar sesión
            </button>
          </Link>
        </div>
    </div>
  );
}

