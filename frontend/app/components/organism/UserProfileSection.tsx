'use client';

import React, { useState, useEffect } from 'react';
import './UserProfileSection.css';
import type { Candidate } from '@/app/types';
import LoadingSpinner from '../atoms/LoadingSpinner';

interface UserProfileSectionProps {
  candidateId: string;
  onClose: () => void;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ candidateId, onClose }) => {
  const [profile, setProfile] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!candidateId) return;
    setLoading(true);
    fetch(`http://127.0.0.1:8000/candidato/${candidateId}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar el perfil:", err);
        setLoading(false);
      });
  }, [candidateId]);

  return (
    <>
      <div className="profile-overlay" onClick={onClose} />
      <div className="user-profile-section">
        <button className="close-button" onClick={onClose} aria-label="Cerrar perfil">×</button>
        {loading && <div className="profile-loading"><LoadingSpinner /></div>}
        {!loading && profile && (
          <>
            <div className="profile-header">
              <div className="profile-avatar">
                <span>{profile.name.charAt(0)}</span>
              </div>
              <div className="profile-header-info">
                <h2 className="profile-name">{profile.name}</h2>
                <p className="profile-position">{profile.position}</p>
              </div>
            </div>
            <div className="profile-body">
              <div className="profile-info-grid">
                <div className="info-item"><span>Email:</span> {profile.email}</div>
                <div className="info-item"><span>Teléfono:</span> {profile.phone || 'No especificado'}</div>
                <div className="info-item"><span>Ubicación:</span> {profile.location}</div>
                <div className="info-item"><span>Experiencia:</span> {profile.experience} años</div>
                <div className="info-item"><span>Disponibilidad:</span> {profile.availability}</div>
                <div className="info-item"><span>Educación:</span> {profile.education}</div>
              </div>
              <div className="profile-skills-section">
                <h3 className="skills-title">Habilidades Clave</h3>
                <div className="skills-list">
                  {profile.skills.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UserProfileSection;