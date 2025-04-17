'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Image
          src="/logo2.svg"
          alt="Logo SkillNet"
          width={120}
          height={40}
          priority
        />
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1>INICIAR SESIÓN</h1>

          <button className={styles.googleButton}>
            Iniciar con Google
          </button>
          <button className={styles.appleButton}>
            Iniciar con Apple
          </button>

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

          <button className={styles.submitButton}>
            Iniciar sesión
          </button>

          {/* Link corregido sin <a> interno */}
          <Link href="/Institucional" className={styles.homeLink}>
            Ir a Home
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.topLinks}>
          <p>Acerca de</p>
          <p>Política de privacidad</p>
          <p>Condiciones de uso</p>
          <p>Accesibilidad</p>
        </div>
        <div className={styles.bottomInfo}>
          <p>Nuestras redes sociales</p>
          <p>+591 777798626</p>
          <p>cybertigres@skillnet.com</p>
          <p>© SkillNet project 2025</p>
        </div>
      </footer>
    </div>
  );
}
