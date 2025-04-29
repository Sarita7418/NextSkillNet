import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  return (
    <div className="login-container">
      <div className="form-container">
        <div className="login-form">
          <div className="form-field">
            <label>Rol</label>
            <div className="select-wrapper">
              <select>
                <option value="">Seleccione un rol</option>
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
              </select>
              <div className="select-arrow">›</div>
            </div>
          </div>
          
          <div className="form-field">
            <label>Contraseña</label>
            <div className="password-field">
              <input 
                type={showPassword1 ? "text" : "password"}
              />
              <button 
                className="password-toggle" 
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
              />
              <button 
                className="password-toggle" 
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? "○" : "⦿"}
              </button>
            </div>
          </div>
          
          <button className="create-button">Crear cuenta</button>
        </div>
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

export default LoginForm;