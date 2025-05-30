'use client';

import { useState } from 'react';

export default function TestRequestPage() {
  const [response, setResponse] = useState('');

  const handleTestRequest = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/testRequest', {
        method: 'GET',
      });
      const data = await res.json();
      setResponse(data.message); // Muestra el mensaje de la respuesta
    } catch (error) {
      setResponse('Hubo un error al realizar la solicitud');
    }
  };

  return (
    <div>
      <button onClick={handleTestRequest}>Hacer solicitud</button>
      <p>{response}</p>
    </div>
  );
}
