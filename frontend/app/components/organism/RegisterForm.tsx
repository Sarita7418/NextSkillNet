"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './RegisterForm.css';
import bienvenida from '../../../public/image 389.svg';
import Image from 'next/image';

const RegisterForm: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    genero: '',
    estadoCivil: '',
    correo: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNext = () => {
    // Guarda los datos en localStorage
    localStorage.setItem('registerData', JSON.stringify(formData));
    // Redirecciona a frame198
    router.push('/frame198');
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <h2 className="form-title">¡Llena el formulario para formar parte de nosotros!
        </h2>

        <div className="form-field">
          <label>Nombre</label>
          <input 
            type="text" 
            name="nombre" 
            value={formData.nombre}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-field">
          <label>Apellido</label>
          <input 
            type="text" 
            name="apellido" 
            value={formData.apellido}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-field">
          <label>Fecha de Nacimiento</label>
          <input 
            type="text" 
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-field">
          <label>Género</label>
          <select
            name="genero"
            value={formData.genero}
            onChange={handleInputChange}
          >
            <option value="">Seleccione género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>
        
        <div className="form-field">
          <label>Estado Civil</label>
          <input 
            type="text" 
            name="estadoCivil"
            value={formData.estadoCivil}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-field">
          <label>Correo electrónico</label>
          <input 
            type="email" 
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
          />
        </div>

        <button className="submit-button" type="button" onClick={handleNext}>
          Siguiente
        </button>
      </div>
      <Image src={bienvenida} alt="Bienvenida" width={500} height={500} />

    </div>
  );
};

export default RegisterForm;
