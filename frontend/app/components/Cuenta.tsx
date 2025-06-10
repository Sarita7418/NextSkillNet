import React, { useEffect, useState } from 'react';

interface Item {
  id: number;
  descripcion: string;
}

interface Usuario {
  id_usuario: number;
}

const Cuenta: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [areas, setAreas] = useState<Item[]>([]);
  const [paises, setPaises] = useState<Item[]>([]);
  const [ciudades, setCiudades] = useState<Item[]>([]);

  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [areaSeleccionada, setAreaSeleccionada] = useState('');
  const [paisSeleccionado, setPaisSeleccionado] = useState('');
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');
  const [formData, setFormData] = useState({
    nombreEmpresa: '',
    areaSeleccionada: '',
    paisSeleccionado: '',
    ciudadSeleccionada: '',
    contrasenaNueva: '',
  });
  const [touched, setTouched] = useState({
    nombreEmpresa: false,
    areaSeleccionada: false,
    paisSeleccionado: false,
    ciudadSeleccionada: false,
    contrasenaNueva: false,
    
  });

  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFormRepresentante, setShowFormRepresentante] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Validaciones
  const validNombre = !!nombreEmpresa.trim();
  const validArea = !!areaSeleccionada;
  const validPais = !!paisSeleccionado;
  const validCiudad = !!ciudadSeleccionada;
  const validNuevaPass = !!contrasenaNueva;

  // Carga usuario de localStorage al montar
  // Carga el usuario y los datos iniciales de los selectores (áreas y países)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('usuario');
      if (u) setUsuario(JSON.parse(u));
    }

    // Cargar Áreas
    fetch('http://127.0.0.1:8000/subdominios/areas')
      .then(res => res.json())
      .then((data: Item[]) => setAreas(data))
      .catch(err => console.error("Error al cargar áreas:", err));
      
    // Cargar Países
    fetch('http://127.0.0.1:8000/politicos_ubicacion/paises')
      .then(res => res.json())
      .then((data: Item[]) => setPaises(data))
      .catch(err => console.error("Error al cargar países:", err));
  }, []);


  // Carga ciudades al cambiar país seleccionado
  useEffect(() => {
  // Si no hay un país seleccionado, limpia la lista de ciudades
  if (!paisSeleccionado) {
    setCiudades([]);
    setCiudadSeleccionada(''); // También limpia la ciudad seleccionada
    return;
  }
    // Cuando se selecciona un país, busca sus ciudades en la API
  fetch(`http://127.0.0.1:8000/politicos_ubicacion/ciudades/${paisSeleccionado}`)
    .then(res => res.json())
    .then((data: Item[]) => setCiudades(data));
    
}, [paisSeleccionado]);
  // Solicitar ser representante
  const handleSolicitarRepresentante = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTouched(t => ({
      ...t,
      nombreEmpresa: true,
      areaSeleccionada: true,
      paisSeleccionado: true,
      ciudadSeleccionada: true,
    }));
    setErrorGeneral('');
    setSuccessMsg('');
    if (!usuario) return setErrorGeneral('Usuario no cargado');
    if (!validNombre || !validArea || !validPais || !validCiudad) {
      setErrorGeneral('Completa todos los campos obligatorios');
      return;
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
        setSuccessMsg('Solicitud enviada correctamente, pendiente de aprobación');
        setShowFormRepresentante(false);
        setNombreEmpresa('');
        setAreaSeleccionada('');
        setPaisSeleccionado('');
        setCiudadSeleccionada('');
        setTouched({
          nombreEmpresa: false,
          areaSeleccionada: false,
          paisSeleccionado: false,
          ciudadSeleccionada: false,
          contrasenaNueva: false,
        });
      } else {
        setErrorGeneral(data.message || 'Error desconocido');
      }
    } catch {
      setErrorGeneral('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar contraseña
  const handleActualizarContrasena = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTouched(t => ({ ...t, contrasenaNueva: true }));
    setErrorGeneral('');
    setSuccessMsg('');
    if (!usuario) return setErrorGeneral('Usuario no cargado');
    if (!validNuevaPass) {
      setErrorGeneral('Ingrese una nueva contraseña');
      return;
    }
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
        setSuccessMsg('Contraseña actualizada correctamente');
        setContrasenaNueva('');
        setTouched(t => ({ ...t, contrasenaNueva: false }));
      } else {
        setErrorGeneral(data.message || 'Error desconocido');
      }
    } catch {
      setErrorGeneral('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const handleCerrarSesion = () => {
    localStorage.removeItem('usuario');
    window.location.href = '/Login';
  };

  // Manejadores de blur
  const handleBlur = (field: keyof typeof touched) => {
    setTouched(t => ({ ...t, [field]: true }));
  };

  return (
    <div className="form-container-std">
      <div className="form-card-std">
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 20 }}>
          Solicitar ser representante de empresa
        </h2>

        {/* BOTÓN para mostrar el formulario */}
        {!showFormRepresentante ? (
          <button
            className="btn-save-std"
            onClick={() => setShowFormRepresentante(true)}
            disabled={loading}
            style={{ marginBottom: 18 }}
          >
            Solicitar ser representante
          </button>
        ) : (
          <form onSubmit={handleSolicitarRepresentante} autoComplete="off">
            {/* Nombre empresa */}
            <div className="form-group-std">
              <label className="form-label-std">
                Nombre empresa
                {touched.nombreEmpresa && !validNombre && (
                  <span className="msg-error-std">Campo obligatorio*</span>
                )}
              </label>
              <input
                className={`input-std${touched.nombreEmpresa && !validNombre ? ' error' : ''}`}
                type="text"
                value={nombreEmpresa}
                onChange={e => setNombreEmpresa(e.target.value)}
                onBlur={() => handleBlur('nombreEmpresa')}
                disabled={loading}
                placeholder="Nombre de la empresa"
              />
            </div>
            {/* Área */}
            <div className="form-group-std">
              <label className="form-label-std">
                Área
                {touched.areaSeleccionada && !validArea && (
                  <span className="msg-error-std">Campo obligatorio*</span>
                )}
              </label>
              <select
                className={`select-std${touched.areaSeleccionada && !validArea ? ' error' : ''}`}
                value={areaSeleccionada}
                onChange={e => setAreaSeleccionada(e.target.value)}
                onBlur={() => handleBlur('areaSeleccionada')}
                disabled={loading}
              >
                <option value="">Seleccione un área</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>
                    {area.descripcion}
                  </option>
                ))}
              </select>
            </div>
            {/* País */}
            <div className="form-group-std">
              <label className="form-label-std">
                País
                {touched.paisSeleccionado && !validPais && (
                  <span className="msg-error-std">Campo obligatorio*</span>
                )}
              </label>
              <select
                className={`select-std${touched.paisSeleccionado && !validPais ? ' error' : ''}`}
                value={paisSeleccionado}
                onChange={e => setPaisSeleccionado(e.target.value)}
                onBlur={() => handleBlur('paisSeleccionado')}
                disabled={loading}
              >
                <option value="">Seleccione un país</option>
                {paises.map(pais => (
                  <option key={pais.id} value={pais.id}>
                    {pais.descripcion}
                  </option>
                ))}
              </select>
            </div>
            {/* Ciudad */}
<div className="form-group-std">
  <label className="form-label-std">Ciudad</label>
  <select
    className={`select-std${touched.ciudadSeleccionada && !validCiudad ? ' error' : ''}`}
    value={ciudadSeleccionada}
    onChange={e => setCiudadSeleccionada(e.target.value)}
    onBlur={() => handleBlur('ciudadSeleccionada')}
    disabled={loading || ciudades.length === 0} // <-- Se deshabilita si no hay ciudades cargadas
    required
  >
    <option value="">Seleccione una ciudad</option>
    {ciudades.map(ciudad => (
      <option key={ciudad.id} value={ciudad.id}>
        {ciudad.descripcion}
      </option>
    ))}
  </select>
</div>
            {/* Mensaje error */}
            {errorGeneral && <div className="msg-error-std" style={{ marginBottom: 12 }}>{errorGeneral}</div>}
            {successMsg && <div style={{ color: '#10b981', marginBottom: 12 }}>{successMsg}</div>}
            {/* Botones */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn-save-std"
                type="submit"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? 'Enviando...' : 'Enviar solicitud'}
              </button>
              <button
                type="button"
                className="btn-save-std"
                style={{ background: '#999', flex: 1 }}
                disabled={loading}
                onClick={() => setShowFormRepresentante(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <hr style={{ margin: '30px 0' }} />

        {/* Cambiar contraseña */}
        <form onSubmit={handleActualizarContrasena} autoComplete="off">
          <div className="form-group-std">
            <label className="form-label-std">
              Nueva contraseña
              {touched.contrasenaNueva && !validNuevaPass && (
                <span className="msg-error-std">Campo obligatorio*</span>
              )}
            </label>
            <input
              className={`input-std${touched.contrasenaNueva && !validNuevaPass ? ' error' : ''}`}
              type="password"
              value={contrasenaNueva}
              onChange={e => setContrasenaNueva(e.target.value)}
              onBlur={() => handleBlur('contrasenaNueva')}
              disabled={loading}
              placeholder="Nueva contraseña"
            />
          </div>
          <button
            className="btn-save-std"
            type="submit"
            disabled={loading}
            style={{ width: '100%' }}
          >
            Cambiar contraseña
          </button>
        </form>

        <hr style={{ margin: '30px 0' }} />

        {/* Cerrar sesión */}
        <button
          className="btn-save-std"
          onClick={handleCerrarSesion}
          style={{
            backgroundColor: '#e53e3e',
            color: 'white',
            display: 'block',
            width: '100%',
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Cuenta;
