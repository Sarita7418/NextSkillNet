'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Footer from '../components/organism/Footer';
import Header from '../components/organism/Header';

interface Interview {
  id: string;
  empresa: string;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'rechazada';
}

export default function InterviewPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [formData, setFormData] = useState({
    empresa: '',
    fecha: '',
    hora: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Simular carga de entrevistas existentes
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/entrevistas');
        const data = await response.json();
        setInterviews(data);
      } catch (err) {
        console.error('Error al cargar entrevistas:', err);
      }
    };

    fetchInterviews();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/entrevistas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newInterview = await response.json();
        setInterviews([...interviews, newInterview]);
        setFormData({ empresa: '', fecha: '', hora: '' });
        alert('¡Entrevista agendada!');
      }
    } catch (err) {
      alert('Error al agendar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <h1>Agendar Entrevista</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Empresa:</label>
            <input
              type="text"
              name="empresa"
              value={formData.empresa}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Hora:</label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleInputChange}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Agendando...' : 'Agendar'}
          </button>
        </form>

        <div className={styles.interviewsList}>
          <h2>Tus Entrevistas</h2>
          {interviews.length === 0 ? (
            <p>No hay entrevistas agendadas</p>
          ) : (
            <ul>
              {interviews.map(interview => (
                <li key={interview.id} className={styles.interviewCard}>
                  <p><strong>Empresa:</strong> {interview.empresa}</p>
                  <p><strong>Fecha:</strong> {interview.fecha} a las {interview.hora}</p>
                  <p><strong>Estado:</strong> 
                    <span className={`${styles.status} ${styles[interview.estado]}`}>
                      {interview.estado}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}