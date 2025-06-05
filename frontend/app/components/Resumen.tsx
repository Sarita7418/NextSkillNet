import React, { useEffect, useState } from 'react';
import foto from '@/public/FotoPerfil.png';
import './Formularios.css';

interface ResumenProps {
  userId: string;
}

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

function esMayorDeEdad(fechaISO: string) {
  if (!fechaISO) return false;
  const hoy = new Date();
  const fecha = new Date(fechaISO);
  let edad = hoy.getFullYear() - fecha.getFullYear();
  const m = hoy.getMonth() - fecha.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
    edad--;
  }
  return edad >= 18;
}

const Resumen: React.FC<ResumenProps> = ({ userId }) => {
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

  // Validaciones
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`http://127.0.0.1:8000/usuario/completo/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Respuesta no OK');
        return res.json();
      })
      .then((data: any) => {
        setUsuario(data);
        let fechaFormateada = '';
        if (data.fecha_nacimiento) {
          const raw = data.fecha_nacimiento.split(' ')[0];
          fechaFormateada = raw;
        }
        setFormData({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          correo: data.correo || '',
          fecha_nacimiento: fechaFormateada,
          genero: data.id_genero ? data.id_genero.toString() : '',
          estado_laboral:
            data.estado_empleado !== undefined
              ? data.estado_empleado.toString()
              : '',
        });
      })
      .catch(err => {
        console.error('Error al obtener perfil completo:', err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // Validaciones
  useEffect(() => {
    const newErrors: typeof errors = {};

    if (touched.nombre && !formData.nombre) newErrors.nombre = 'Campo obligatorio*';
    if (touched.apellido && !formData.apellido) newErrors.apellido = 'Campo obligatorio*';
    if (touched.correo && !formData.correo) newErrors.correo = 'Campo obligatorio*';
    if (touched.fecha_nacimiento && !formData.fecha_nacimiento)
      newErrors.fecha_nacimiento = 'Campo obligatorio*';
    if (
      touched.fecha_nacimiento &&
      formData.fecha_nacimiento &&
      !esMayorDeEdad(formData.fecha_nacimiento)
    )
      newErrors.fecha_nacimiento = 'Se debe tener al menos 18 años';
    if (touched.genero && !formData.genero) newErrors.genero = 'Campo obligatorio*';
    if (touched.estado_laboral && !formData.estado_laboral)
      newErrors.estado_laboral = 'Campo obligatorio*';

    setErrors(newErrors);
  }, [formData, touched]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Toca todos los campos al intentar enviar
    setTouched({
      nombre: true,
      apellido: true,
      correo: true,
      fecha_nacimiento: true,
      genero: true,
      estado_laboral: true,
    });

    // Validación final
    const camposObligatorios = [
      'nombre',
      'apellido',
      'correo',
      'fecha_nacimiento',
      'genero',
      'estado_laboral',
    ];
    let hayError = false;
    for (const campo of camposObligatorios) {
      if (
        !formData[campo as keyof typeof formData] ||
        (campo === 'fecha_nacimiento' &&
          formData.fecha_nacimiento &&
          !esMayorDeEdad(formData.fecha_nacimiento))
      ) {
        hayError = true;
        break;
      }
    }
    if (hayError) return;

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/actualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: userId,
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
          correo: formData.correo,
        };
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
    <div className="form-container-std">
      <div className="form-card-std">
        <div className="foto-perfil-std">
          <img src={foto.src} alt="" />
        </div>

        <form
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Nombre */}
          <div className="form-group-std">
            <label className="form-label-std" htmlFor="nombre">
              Nombre:
              {errors.nombre && (
                <span className="msg-error-std">{errors.nombre}</span>
              )}
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              className={`input-std${errors.nombre ? ' error' : ''}`}
              value={formData.nombre}
              onChange={handleChange}
              disabled={loading}
              autoComplete="off"
              onBlur={() => setTouched(prev => ({ ...prev, nombre: true }))}
            />
          </div>

          {/* Apellido */}
          <div className="form-group-std">
            <label className="form-label-std" htmlFor="apellido">
              Apellido:
              {errors.apellido && (
                <span className="msg-error-std">{errors.apellido}</span>
              )}
            </label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              className={`input-std${errors.apellido ? ' error' : ''}`}
              value={formData.apellido}
              onChange={handleChange}
              disabled={loading}
              autoComplete="off"
              onBlur={() => setTouched(prev => ({ ...prev, apellido: true }))}
            />
          </div>

          {/* Correo */}
          <div className="form-group-std">
            <label className="form-label-std" htmlFor="correo">
              Correo electrónico:
              {errors.correo && (
                <span className="msg-error-std">{errors.correo}</span>
              )}
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              className={`input-std${errors.correo ? ' error' : ''}`}
              value={formData.correo}
              onChange={handleChange}
              disabled={loading}
              autoComplete="off"
              onBlur={() => setTouched(prev => ({ ...prev, correo: true }))}
            />
          </div>

          {/* Fecha de nacimiento */}
          <div className="form-group-std">
            <label className="form-label-std" htmlFor="fecha_nacimiento">
              Fecha de nacimiento:
              {errors.fecha_nacimiento && (
                <span className="msg-error-std">{errors.fecha_nacimiento}</span>
              )}
            </label>
            <input
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              type="date"
              className={`input-std${errors.fecha_nacimiento ? ' error' : ''}`}
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              disabled={loading}
              onBlur={() => setTouched(prev => ({ ...prev, fecha_nacimiento: true }))}
            />
          </div>

          {/* Género */}
          <div className="form-group-std">
            <label className="form-label-std" htmlFor="genero">
              Género:
              {errors.genero && (
                <span className="msg-error-std">{errors.genero}</span>
              )}
            </label>
            <select
              id="genero"
              name="genero"
              className={`select-std${errors.genero ? ' error' : ''}`}
              value={formData.genero}
              onChange={handleChange}
              disabled={loading}
              onBlur={() => setTouched(prev => ({ ...prev, genero: true }))}
            >
              <option value="">Seleccione un género</option>
              {subdominiosGenero.map(g => (
                <option key={g.id} value={g.id}>
                  {g.descripcion}
                </option>
              ))}
            </select>
          </div>

          {/* Estado laboral */}
          <div className="form-group-std">
            <label className="form-label-std" htmlFor="estado_laboral">
              Estado laboral:
              {errors.estado_laboral && (
                <span className="msg-error-std">{errors.estado_laboral}</span>
              )}
            </label>
            <select
              id="estado_laboral"
              name="estado_laboral"
              className={`select-std${errors.estado_laboral ? ' error' : ''}`}
              value={formData.estado_laboral}
              onChange={handleChange}
              disabled={loading}
              onBlur={() => setTouched(prev => ({ ...prev, estado_laboral: true }))}
            >
              <option value="">Seleccione estado</option>
              {estadosLaborales.map(e => (
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
            className="btn-save-std"
          >
            {loading ? 'Guardando...' : 'Guardar datos'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Resumen;
