<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CandidatoController extends Controller
{
    /**
     * Lista todos los candidatos con su información detallada para el frontend.
     */
    public function listar()
    {
        try {
            // VERSIÓN FINAL Y COMPLETA DE LA CONSULTA
            $candidatos = DB::select("
                WITH ExperienciaReciente AS (
                    SELECT
                        id_persona,
                        id_cargo,
                        id_ciudad,
                        ROW_NUMBER() OVER(PARTITION BY id_persona ORDER BY ISNULL(fecha_out_trab, '9999-12-31') DESC, fecha_in_trab DESC) as rn
                    FROM exp_laboral
                ),
                EducacionReciente AS (
                    SELECT
                        e.id_persona,
                        CONCAT(grado.descripcion, ' en ', especialidad.descripcion) as educacion_completa,
                        ROW_NUMBER() OVER(PARTITION BY e.id_persona ORDER BY ISNULL(e.fecha_titulacion, '1900-01-01') DESC) as rn
                    FROM
                        educacion e
                    LEFT JOIN dbo.subdominios grado ON e.id_tipoGrado = grado.id
                    LEFT JOIN dbo.subdominios especialidad ON e.id_ocupacion = especialidad.id
                ),
                DocumentoCV AS (
                    SELECT
                        id_persona,
                        recurso,
                        ROW_NUMBER() OVER(PARTITION BY id_persona ORDER BY fecha_hor_carga DESC) as rn
                    FROM documentos
                    WHERE id_tipoDocumento = (SELECT id FROM subdominios WHERE descripcion = 'CV')
                )
                SELECT
                    p.id_persona AS id,
                    p.nombre + ' ' + p.apellido AS name,
                    correo.descripcion AS email,
                    p.telefono AS phone,
                    
                    -- CORRECCIÓN #2: Usamos ISNULL para manejar cargos vacíos
                    ISNULL(cargo.descripcion, 'Cargo no especificado') AS position,
                    
                    ISNULL((SELECT SUM(DATEDIFF(year, el.fecha_in_trab, ISNULL(el.fecha_out_trab, GETDATE()))) FROM exp_laboral el WHERE el.id_persona = p.id_persona), 0) AS experience,
                    (SELECT STRING_AGG(h.descripcion, ', ') FROM persona_habilidades ph JOIN subdominios h ON ph.id_habilidad = h.id WHERE ph.id_persona = p.id_persona) AS skills,
                    ciudad.descripcion AS location,
                    p.salario_esperado AS salary,
                    p.disponibilidad AS availability,
                    
                    -- CORRECCIÓN #1: Usamos el campo concatenado para la educación completa
                    edur.educacion_completa AS education, 
                    
                    p.url_imagen_perfil AS profileImage,
                    cv.recurso AS resumeUrl,
                    u.fecha_registro AS createdAt
                FROM
                    dbo.personas p
                LEFT JOIN dbo.usuarios u ON p.id_persona = u.id_persona
                LEFT JOIN (SELECT id_persona, MIN(descripcion) as descripcion FROM dbo.correo GROUP BY id_persona) correo ON p.id_persona = correo.id_persona
                LEFT JOIN ExperienciaReciente er ON p.id_persona = er.id_persona AND er.rn = 1
                LEFT JOIN dbo.subdominios cargo ON er.id_cargo = cargo.id
                LEFT JOIN dbo.politicos_ubicacion ciudad ON er.id_ciudad = ciudad.id
                LEFT JOIN EducacionReciente edur ON p.id_persona = edur.id_persona AND edur.rn = 1
                LEFT JOIN DocumentoCV cv ON p.id_persona = cv.id_persona AND cv.rn = 1
                WHERE u.id_rol = 1;
            ");
            
            foreach ($candidatos as $candidato) {
                $candidato->skills = $candidato->skills ? explode(', ', $candidato->skills) : [];
            }

            return response()->json($candidatos, 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener la lista de candidatos',
                'mensaje' => $e->getMessage(),
                'linea' => $e->getLine()
            ], 500);
        }
    }
}