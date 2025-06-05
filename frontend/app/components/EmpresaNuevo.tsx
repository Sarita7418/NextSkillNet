import React, { useEffect, useState } from 'react';
import './Formularios.css';

interface Item {
  id: number;
  descripcion: string;
}

const EmpresaNuevo: React.FC = () => {
  // State de datos del formulario
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [areaSeleccionada, setAreaSeleccionada] = useState('');
  const [paisSeleccionado, setPaisSeleccionado] = useState('');
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');

  // Opciones
  const [areas, setAreas] = useState<Item[]>([]);
  const [paises, setPaises] = useState<Item[]>([]);
  const [ciudades, setCiudades] = useState<Item[]>([]);

  // Validaciones
  const [touched, setTouched] = useState({
    nombreEmpresa: false,
    areaSeleccionada: false,
    paisSeleccionado: false,
    ciudadSeleccionada: false,
  });
  const [loading, setLoading] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');

  // Cargar áreas y países al montar
  useEffect(() => {
    fetch('http://127.0.0.1:8000/subdominios/areas')
      .then(res => res.json())
      .then((data: Item[]) => setAreas(data))
      .catch(() => setErrorGeneral('Error cargando áreas'));

    fetch('http://127.0.0.1:8000/politicos_ubicacion/paises')
      .then(res => res.json())
      .then((data: Item[]) => setPaises(data))
      .catch(() => setErrorGeneral('Error cargando países'));
  }, []);

  // Cargar ciudades cuando cambie el país seleccionado
  useEffect(() => {
    if (!paisSeleccionado) {
      setCiudades([]);
      setCiudadSeleccionada('');
      return;
    }
    fetch(`http://127.0.0.1:8000/politicos_ubicacion/ciudades/${paisSeleccionado}`)
      .then(res => res.json())
      .then((data: Item[]) => setCiudades(data))
      .catch(() => setErrorGeneral('Error cargando ciudades'));
  }, [paisSeleccionado]);

  // Validaciones por campo
  const validNombre = !!nombreEmpresa.trim();
  const validArea = !!areaSeleccionada;
  const validPais = !!paisSeleccionado;
  const validCiudad = !!ciudadSeleccionada;

  // Validación global
  const validForm = validNombre && validArea && validPais && validCiudad;

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      nombreEmpresa: true,
      areaSeleccionada: true,
      paisSeleccionado: true,
      ciudadSeleccionada: true,
    });
    setErrorGeneral('');

    if (!validForm) return;

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/admin/empresa/anadir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombreEmpresa,
          id_area: parseInt(areaSeleccionada, 10),
          id_ciudad: parseInt(ciudadSeleccionada, 10),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Empresa registrada correctamente');
        setNombreEmpresa('');
        setAreaSeleccionada('');
        setPaisSeleccionado('');
        setCiudadSeleccionada('');
        setTouched({
          nombreEmpresa: false,
          areaSeleccionada: false,
          paisSeleccionado: false,
          ciudadSeleccionada: false,
        });
      } else {
        setErrorGeneral(data.message || 'Error al registrar');
      }
    } catch {
      setErrorGeneral('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Manejadores de cambio de campo (para setTouched en blur)
  const handleBlur = (field: keyof typeof touched) => {
    setTouched(t => ({ ...t, [field]: true }));
  };

  return (
    <div className="form-container-std">
      <form className="form-card-std" onSubmit={handleSubmit} autoComplete="off">
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 12 }}>Registrar nueva empresa</h2>
        
        {/* Nombre */}
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
            placeholder="Nombre de la empresa"
            disabled={loading}
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

        {errorGeneral && <div className="msg-error-std" style={{ marginBottom: 14 }}>{errorGeneral}</div>}

        <button
          className="btn-save-std"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrar empresa'}
        </button>
      </form>
    </div>
  );
};

export default EmpresaNuevo;
