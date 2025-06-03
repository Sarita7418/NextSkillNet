import React from 'react';
import './SubirArchivo.css';

interface Props {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SubirArchivo: React.FC<Props> = ({ label, onChange }) => {
  return (
    <div className="file-upload-field">
      <label className="upload-label">{label}</label>
      <input 
        type="file" 
        accept=".pdf,.docx,image/*" 
        onChange={onChange} 
        className="upload-input"
      />
    </div>
  );
};

export default SubirArchivo;