import React from 'react';
import './RegistrationNotice.css';
import Link from 'next/link';
import Image from 'next/image'

const RegistrationNotice: React.FC = () => {
  return (
    <div className="registration-container">
      <div className="content-wrapper">
        <div className="notice-card">
          <p className="notice-text">
            Querido usuario para poder acceder a mas 
            secciones de nuestra plataforma debe de registrarse 
            y crear su respectiva cuenta.
          </p>
          <Link href="/Login">
          <button className="create-account-button">Crear cuenta</button>
          </Link>
          
        </div>
        <Image className='logo'
          src="/public/primerlogo.png" // Ruta de la imagen en public/images/
          alt="Descripción de la imagen"
          width={1024} // Ancho de la imagen
          height={349} // Altura de la imagen
         />
      </div>
      
      
    </div>
  );
};

export default RegistrationNotice;