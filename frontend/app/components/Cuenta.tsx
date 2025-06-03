import React, { useEffect, useState } from 'react';

interface Item {
  id: number;
  descripcion: string;
}

interface Usuario {
  id_usuario: number;
  // Puedes agregar más campos si los necesitas
}

function Cuenta() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [areas, setAreas] = useState<Item[]>([]);
  const [paises, setPaises] = useState<Item[]>([]);
  const [ciudades, setCiudades] = useState<Item[]>([]);

  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [areaSeleccionada, setAreaSeleccionada] = useState('');
  const [paisSeleccionado, setPaisSeleccionado] = useState('');
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');

  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFormRepresentante, setShowFormRepresentante] = useState(false);

  // Carga usuario de localStorage al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('usuario');
      if (u) setUsuario(JSON.parse(u));
    }
  }, []);

  // Carga áreas y países al montar
  useEffect(() => {
    fetch('http://127.0.0.1:8000/subdominios/areas')
      .then(res => res.json())
      .then((data: Item[]) => setAreas(data))
      .catch(() => alert('Error cargando áreas'));

    fetch('http://127.0.0.1:8000/politicos_ubicacion/paises')
      .then(res => res.json())
      .then((data: Item[]) => setPaises(data))
      .catch(() => alert('Error cargando países'));
  }, []);

  // Carga ciudades al cambiar país seleccionado
  useEffect(() => {
    if (!paisSeleccionado) {
      setCiudades([]);
      setCiudadSeleccionada('');
      return;
    }
    fetch(`http://127.0.0.1:8000/politicos_ubicacion/ciudades/${paisSeleccionado}`)
      .then(res => res.json())
      .then((data: Item[]) => setCiudades(data))
      .catch(() => alert('Error cargando ciudades'));
  }, [paisSeleccionado]);

  // Solicitar ser representante
  const handleSolicitarRepresentante = async () => {
    if (!usuario) return alert('Usuario no cargado');
    if (!nombreEmpresa || !areaSeleccionada || !paisSeleccionado || !ciudadSeleccionada) {
      return alert('Complete todos los campos para solicitar representante');
    }

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/usuario/solicitar_representante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: usuario.id_usuario,
          nombre_empresa: nombreEmpresa,
          id_area: parseInt(areaSeleccionada, 10),
          id_ciudad: parseInt(ciudadSeleccionada, 10),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Solicitud enviada correctamente, pendiente de aprobación');
        setShowFormRepresentante(false);
        setNombreEmpresa('');
        setAreaSeleccionada('');
        setPaisSeleccionado('');
        setCiudadSeleccionada('');
      } else {
        alert(`Error: ${data.message || 'Error desconocido'}`);
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar contraseña
  const handleActualizarContrasena = async () => {
    if (!usuario) return alert('Usuario no cargado');
    if (!contrasenaNueva) return alert('Ingrese una nueva contraseña');

    if (!confirm('¿Está seguro de cambiar su contraseña?')) return;

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/usuario/actualizar_contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: usuario.id_usuario,
          contrasena: contrasenaNueva,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Contraseña actualizada correctamente');
        setContrasenaNueva('');
      } else {
        alert(`Error: ${data.message || 'Error desconocido'}`);
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const handleCerrarSesion = () => {
    localStorage.removeItem('usuario');
    window.location.href = '/Login'; // O la ruta de login que tengas
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 20 }}>
        Solicitar ser representante de empresa
      </h2>

      {!showFormRepresentante ? (
        <button
          onClick={() => setShowFormRepresentante(true)}
          disabled={loading}
          style={{
            display: 'block',
            margin: '0 auto 20px auto',
            padding: '10px 20px',
            backgroundColor: '#143D8D',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          Solicitar ser representante
        </button>
      ) : (
        <div style={{ marginBottom: 20 }}>
          <label>
            Nombre empresa:
            <input
              type="text"
              value={nombreEmpresa}
              onChange={e => setNombreEmpresa(e.target.value)}
              disabled={loading}
              style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 8, border: '1px solid #ccc' }}
            />
          </label>

          <label>
            Área:
            <select
              value={areaSeleccionada}
              onChange={e => setAreaSeleccionada(e.target.value)}
              disabled={loading}
              style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 8, border: '1px solid #ccc' }}
            >
              <option value="">Seleccione un área</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.descripcion}
                </option>
              ))}
            </select>
          </label>

          <label>
            País:
            <select
              value={paisSeleccionado}
              onChange={e => setPaisSeleccionado(e.target.value)}
              disabled={loading}
              style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 8, border: '1px solid #ccc' }}
            >
              <option value="">Seleccione un país</option>
              {paises.map(pais => (
                <option key={pais.id} value={pais.id}>
                  {pais.descripcion}
                </option>
              ))}
            </select>
          </label>

          <label>
            Ciudad:
            <select
              value={ciudadSeleccionada}
              onChange={e => setCiudadSeleccionada(e.target.value)}
              disabled={loading || ciudades.length === 0}
              style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 8, border: '1px solid #ccc' }}
            >
              <option value="">Seleccione una ciudad</option>
              {ciudades.map(ciudad => (
                <option key={ciudad.id} value={ciudad.id}>
                  {ciudad.descripcion}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={handleSolicitarRepresentante}
            disabled={loading}
            style={{
              marginTop: 10,
              padding: '10px 20px',
              backgroundColor: '#143D8D',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
            }}
          >
            Enviar solicitud
          </button>

          <button
            onClick={() => setShowFormRepresentante(false)}
            disabled={loading}
            style={{
              marginTop: 10,
              marginLeft: 10,
              padding: '10px 20px',
              backgroundColor: '#999',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
            }}
          >
            Cancelar
          </button>
        </div>
      )}

      <hr style={{ margin: '30px 0' }} />

      <div>
        <label>
          Nueva contraseña:
          <input
            type="password"
            value={contrasenaNueva}
            onChange={e => setContrasenaNueva(e.target.value)}
            disabled={loading}
            style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 8, border: '1px solid #ccc' }}
          />
        </label>

        <button
          onClick={handleActualizarContrasena}
          disabled={loading}
          style={{
            marginTop: 10,
            padding: '10px 20px',
            backgroundColor: '#143D8D',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          Cambiar contraseña
        </button>
      </div>

      <hr style={{ margin: '30px 0' }} />

      <button
        onClick={handleCerrarSesion}
        style={{
          padding: '10px 20px',
          backgroundColor: '#e53e3e',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontWeight: 'bold',
          display: 'block',
          margin: '0 auto',
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default Cuenta;
