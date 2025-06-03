import React, { useEffect, useState } from 'react';

// Subdominios para género (idPadre=1)
const subdominiosGenero = [
  { id: 1, descripcion: 'masculino' },
  { id: 2, descripcion: 'femenino' },
];

// Estado laboral (fijo)
const estadosLaborales = [
  { id: 0, descripcion: 'Desempleado' },
  { id: 1, descripcion: 'Empleado' },
];

function Resumen() {
  const [usuario, setUsuario] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    fecha_nacimiento: '',
    genero: '',
    estado_laboral: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('usuario');
    if (u) {
      const usuarioObj = JSON.parse(u);
      setUsuario(usuarioObj);
      setFormData({
        nombre: usuarioObj.nombre || '',
        apellido: usuarioObj.apellido || '',
        correo: usuarioObj.correos && usuarioObj.correos.length > 0 ? usuarioObj.correos[0] : '',
        fecha_nacimiento: usuarioObj.fecha_nacimiento ? usuarioObj.fecha_nacimiento.split('T')[0] : '',
        genero: usuarioObj.id_genero ? usuarioObj.id_genero.toString() : '',
        estado_laboral: usuarioObj.estado_empleado !== undefined ? usuarioObj.estado_empleado.toString() : '',
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/actualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: usuario.id_usuario,
          nombre: formData.nombre,
          apellido: formData.apellido,
          correo: formData.correo,
          fecha_nacimiento: formData.fecha_nacimiento,
          genero: parseInt(formData.genero, 10),
          estado_empleado: parseInt(formData.estado_laboral, 10),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Datos actualizados correctamente');
        const usuarioActualizado = {
          ...usuario,
          nombre: formData.nombre,
          apellido: formData.apellido,
          fecha_nacimiento: formData.fecha_nacimiento,
          id_genero: parseInt(formData.genero, 10),
          estado_empleado: parseInt(formData.estado_laboral, 10),
          correos: [formData.correo],
        };
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        setUsuario(usuarioActualizado);
      } else {
        alert(`Error al actualizar: ${data.message || 'Error desconocido'}`);
      }
    } catch {
      alert('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) return <p>Cargando usuario...</p>;

  return (
    <div
      className="resumen-container"
      style={{
        maxWidth: 600,
        margin: '0 auto',
        height: '100%',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        padding: '20px',
      }}
    >
      {/* Foto perfil */}
      <div
        className="foto-perfil"
        style={{
          width: 150,
          height: 150,
          borderRadius: '50%',
          backgroundColor: '#cbd5e1',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 24,
          color: '#64748b',
          userSelect: 'none',
        }}
      >
        Foto
      </div>

      <form
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 15,
        }}
        onSubmit={handleSubmit}
      >
        {/* Nombre */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="nombre" style={{ marginBottom: 6, fontWeight: 600 }}>
            Nombre:
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            disabled={loading}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #ddd',
              backgroundColor: '#f9fafb',
              fontSize: 16,
              outline: 'none',
            }}
          />
        </div>

        {/* Apellido */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="apellido" style={{ marginBottom: 6, fontWeight: 600 }}>
            Apellido:
          </label>
          <input
            id="apellido"
            name="apellido"
            type="text"
            value={formData.apellido}
            onChange={handleChange}
            disabled={loading}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #ddd',
              backgroundColor: '#f9fafb',
              fontSize: 16,
              outline: 'none',
            }}
          />
        </div>

        {/* Correo */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="correo" style={{ marginBottom: 6, fontWeight: 600 }}>
            Correo electrónico:
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            disabled={loading}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #ddd',
              backgroundColor: '#f9fafb',
              fontSize: 16,
              outline: 'none',
            }}
          />
        </div>

        {/* Fecha de nacimiento */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="fecha_nacimiento" style={{ marginBottom: 6, fontWeight: 600 }}>
            Fecha de nacimiento:
          </label>
          <input
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            type="date"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            disabled={loading}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #ddd',
              backgroundColor: '#f9fafb',
              fontSize: 16,
              outline: 'none',
            }}
          />
        </div>

        {/* Género */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="genero" style={{ marginBottom: 6, fontWeight: 600 }}>
            Género:
          </label>
          <select
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            disabled={loading}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #ddd',
              backgroundColor: '#f9fafb',
              fontSize: 16,
              outline: 'none',
            }}
          >
            <option value="">Seleccione un género</option>
            {subdominiosGenero.map((g) => (
              <option key={g.id} value={g.id}>
                {g.descripcion}
              </option>
            ))}
          </select>
        </div>

        {/* Estado laboral */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="estado_laboral" style={{ marginBottom: 6, fontWeight: 600 }}>
            Estado laboral:
          </label>
          <select
            id="estado_laboral"
            name="estado_laboral"
            value={formData.estado_laboral}
            onChange={handleChange}
            disabled={loading}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #ddd',
              backgroundColor: '#f9fafb',
              fontSize: 16,
              outline: 'none',
            }}
          >
            <option value="">Seleccione estado</option>
            {estadosLaborales.map((e) => (
              <option key={e.id} value={e.id}>
                {e.descripcion}
              </option>
            ))}
          </select>
        </div>

        {/* Botón guardar */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: 16,
            marginTop: 10,
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#1e40af';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#2563eb';
          }}
        >
          {loading ? 'Guardando...' : 'Guardar datos'}
        </button>
      </form>
    </div>
  );
}

export default Resumen;
