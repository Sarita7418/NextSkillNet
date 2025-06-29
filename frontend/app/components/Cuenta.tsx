import React, { useEffect, useState } from 'react';

interface Item {
  id: number;
  descripcion: string;
}

interface Empresa {
  id_empresa: number;
  nombre: string;
  area: string;
  ciudad: string;
}

interface Usuario {
  id_usuario: number;
}

const Cuenta: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [areas, setAreas] = useState<Item[]>([]);
  const [paises, setPaises] = useState<Item[]>([]);
  const [ciudades, setCiudades] = useState<Item[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<string>(''); // almacena el id_empresa o "nueva"

  // Formulario para nueva empresa
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
    confirmarContrasena: false,
  });

  // Contraseña
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [showFormRepresentante, setShowFormRepresentante] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Validaciones de formulario nueva empresa
  const validNombre = !!nombreEmpresa.trim();
  const validArea = !!areaSeleccionada;
  const validPais = !!paisSeleccionado;
  const validCiudad = !!ciudadSeleccionada;
  const validEmpresaSeleccionada = !!empresaSeleccionada;

  // Contraseña validaciones
  const validNuevaPass = !!contrasenaNueva;
  const coincidenPass = contrasenaNueva === confirmarContrasena && contrasenaNueva.length > 0;

  // Carga usuario de localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('usuario');
      if (u) setUsuario(JSON.parse(u));
    }
  }, []);

  // Carga áreas y países
  useEffect(() => {
    fetch('http://127.0.0.1:8000/subdominios/areas')
      .then(res => res.json())
      .then((data: Item[]) => setAreas(data))
      .catch(err => console.error("Error al cargar áreas:", err));
      
    // Cargar Países
    fetch('http://127.0.0.1:8000/politicos_ubicacion/paises')
      .then(res => res.json())
      .then((data: Item[]) => setPaises(data));
    fetch('http://127.0.0.1:8000/admin/empresas')
      .then(res => res.json())
      .then((data: Empresa[]) => setEmpresas(data));
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
      .then((data: Item[]) => setCiudades(data));
  }, [paisSeleccionado]);

  // ----------- Formulario representante -------------
  const handleSolicitarRepresentante = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorGeneral('');
    setSuccessMsg('');
    setTouched(t => ({
      ...t,
      nombreEmpresa: true,
      areaSeleccionada: true,
      paisSeleccionado: true,
      ciudadSeleccionada: true,
    }));

    if (!usuario) return setErrorGeneral('Usuario no cargado');
    if (!validEmpresaSeleccionada) {
      setErrorGeneral('Seleccione una empresa o la opción para registrar nueva empresa');
      return;
    }

    let payload: any = {
      id_usuario: usuario.id_usuario,
    };

    if (empresaSeleccionada !== 'nueva') {
      // Empresa EXISTENTE
      payload = {
        ...payload,
        nombre_empresa: `idEmpresa=${empresaSeleccionada}`,
        id_area: 1,      // Forzados, no se usan realmente
        id_ciudad: 1,
      };
    } else {
      // Nueva empresa: validar campos
      if (!validNombre || !validArea || !validPais || !validCiudad) {
        setErrorGeneral('Completa todos los campos obligatorios de la empresa');
        return;
      }
      payload = {
        ...payload,
        nombre_empresa: nombreEmpresa,
        id_area: parseInt(areaSeleccionada, 10),
        id_ciudad: parseInt(ciudadSeleccionada, 10),
      };
    }

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/usuario/solicitar_representante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Solicitud enviada correctamente, pendiente de aprobación');
        setShowFormRepresentante(false);
        // Limpiar todo
        setEmpresaSeleccionada('');
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
          confirmarContrasena: false,
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

  // ----------- Contraseña -----------
  const handleActualizarContrasena = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTouched(t => ({ ...t, contrasenaNueva: true, confirmarContrasena: true }));
    setErrorGeneral('');
    setSuccessMsg('');
    if (!usuario) return setErrorGeneral('Usuario no cargado');
    if (!validNuevaPass) return setErrorGeneral('Ingrese una nueva contraseña');
    if (!coincidenPass) return setErrorGeneral('Las contraseñas no coinciden');
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
        setConfirmarContrasena('');
        setTouched(t => ({ ...t, contrasenaNueva: false, confirmarContrasena: false }));
      } else {
        setErrorGeneral(data.message || 'Error desconocido');
      }
    } catch {
      setErrorGeneral('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // ----------- Otros -------------
  const handleCerrarSesion = () => {
    localStorage.removeItem('usuario');
    window.location.href = '/Login';
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(t => ({ ...t, [field]: true }));
  };

  // ----------- Render -------------
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
            {/* ComboBox empresas */}
            <div className="form-group-std">
              <label className="form-label-std">
                Seleccione su empresa
                {!empresaSeleccionada && (
                  <span className="msg-error-std">Campo obligatorio*</span>
                )}
              </label>
              <select
                className={`select-std${!empresaSeleccionada ? ' error' : ''}`}
                value={empresaSeleccionada}
                onChange={e => setEmpresaSeleccionada(e.target.value)}
                disabled={loading}
              >
                <option value="">Seleccione una empresa</option>
                <option value="nueva">MI EMPRESA NO ESTÁ EN ESTE LISTADO</option>
                {empresas.map(emp => (
                  <option key={emp.id_empresa} value={emp.id_empresa}>
                    {emp.nombre} &mdash; {emp.area} ({emp.ciudad})
                  </option>
                ))}
              </select>
            </div>
            {/* Formulario solo si es nueva empresa */}
            {empresaSeleccionada === 'nueva' && (
              <>
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
                <div className="form-group-std">
                  <label className="form-label-std">
                    Ciudad
                    {touched.ciudadSeleccionada && !validCiudad && (
                      <span className="msg-error-std">Campo obligatorio*</span>
                    )}
                  </label>
                  <select
                    className={`select-std${touched.ciudadSeleccionada && !validCiudad ? ' error' : ''}`}
                    value={ciudadSeleccionada}
                    onChange={e => setCiudadSeleccionada(e.target.value)}
                    onBlur={() => handleBlur('ciudadSeleccionada')}
                    disabled={loading || ciudades.length === 0}
                  >
                    <option value="">Seleccione una ciudad</option>
                    {ciudades.map(ciudad => (
                      <option key={ciudad.id} value={ciudad.id}>
                        {ciudad.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {/* Mensaje error/success */}
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
          <div className="form-group-std">
            <label className="form-label-std">
              Confirmar nueva contraseña
              {touched.confirmarContrasena && !coincidenPass && (
                <span className="msg-error-std">
                  {confirmarContrasena ? 'Las contraseñas no coinciden' : 'Campo obligatorio*'}
                </span>
              )}
            </label>
            <input
              className={`input-std${touched.confirmarContrasena && !coincidenPass ? ' error' : ''}`}
              type="password"
              value={confirmarContrasena}
              onChange={e => setConfirmarContrasena(e.target.value)}
              onBlur={() => handleBlur('confirmarContrasena')}
              disabled={loading}
              placeholder="Confirmar nueva contraseña"
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
