import React from 'react';
import './RegisterForm.css';
import Link from 'next/link';

const RegisterForm: React.FC = () => {
  return (
    <div className="register-container">
      <div className="form-container">
        <h2 className="form-title">CREA TU CUENTA</h2>
        
        <div className="form-field">
          <label>Nombre</label>
          <input type="text" />
        </div>
        
        <div className="form-field">
          <label>Apellido</label>
          <input type="text" />
        </div>
        
        <div className="form-field">
          <label>Fecha de Nacimiento</label>
          <input type="text" />
        </div>
        
        <div className="form-field">
          <label>Género</label>
          <input type="text" />
        </div>
        
        <div className="form-field">
          <label>Estado Civil</label>
          <input type="text" />
        </div>
        
        <div className="form-field">
          <label>Correo electrónico</label>
          <input type="email" />
        </div>
        <Link href="/frame198">
        <button className="submit-button">Siguiente</button>
          </Link>
        
      </div>
      
      <div className="welcome-container">
        <div className="welcome-content">
          <h1 className="welcome-title">BIENVENIDO <br />SKILLNET</h1>
          <div className="welcome-illustration">
            <div className="profile-card-main">
              <div className="profile-icon-main"></div>
              <div className="profile-lines"></div>
            </div>
            
            <div className="profile-card-secondary">
              <div className="profile-icon-small"></div>
              <div className="profile-lines-small"></div>
            </div>
            
            <div className="magnifying-glass">
              <div className="glass-circle"></div>
              <div className="glass-handle"></div>
            </div>
            
            <div className="checkmark">
              <div className="check-circle">
                <div className="check-icon"></div>
              </div>
            </div>
            
            <div className="profile-dots"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;