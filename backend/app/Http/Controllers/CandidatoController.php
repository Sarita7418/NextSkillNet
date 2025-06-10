<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Gemini\Laravel\Facades\Gemini;

class CandidatoController extends Controller
{
    /**
     * MÉTODO PRIVADO para obtener los perfiles de candidatos.
     * Esta es ahora nuestra ÚNICA fuente de datos.
     */
    public function obtenerPerfilesDeCandidatos()
    {
        // Esta es la consulta SQL que ya habíamos perfeccionado
        $candidatos = DB::select("
            WITH ExperienciaReciente AS (
                SELECT id_persona, id_cargo, id_ciudad, ROW_NUMBER() OVER(PARTITION BY id_persona ORDER BY ISNULL(fecha_out_trab, '9999-12-31') DESC, fecha_in_trab DESC) as rn FROM exp_laboral
            ),
            EducacionReciente AS (
                SELECT e.id_persona, CONCAT(grado.descripcion, ' en ', especialidad.descripcion) as educacion_completa, ROW_NUMBER() OVER(PARTITION BY e.id_persona ORDER BY ISNULL(e.fecha_titulacion, '1900-01-01') DESC) as rn
                FROM educacion e
                LEFT JOIN dbo.subdominios grado ON e.id_tipoGrado = grado.id
                LEFT JOIN dbo.subdominios especialidad ON e.id_ocupacion = especialidad.id
            ),
            DocumentoCV AS (
                SELECT id_persona, recurso, ROW_NUMBER() OVER(PARTITION BY id_persona ORDER BY fecha_hor_carga DESC) as rn
                FROM documentos WHERE id_tipoDocumento = (SELECT id FROM subdominios WHERE descripcion = 'CV')
            )
            SELECT
                p.id_persona AS id, p.nombre + ' ' + p.apellido AS name, correo.descripcion AS email, p.telefono AS phone,
                ISNULL(cargo.descripcion, 'Cargo no especificado') AS position,
                ISNULL((SELECT SUM(DATEDIFF(year, el.fecha_in_trab, ISNULL(el.fecha_out_trab, GETDATE()))) FROM exp_laboral el WHERE el.id_persona = p.id_persona), 0) AS experience,
                (SELECT STRING_AGG(h.descripcion, ', ') FROM persona_habilidades ph JOIN subdominios h ON ph.id_habilidad = h.id WHERE ph.id_persona = p.id_persona) AS skills,
                ciudad.descripcion AS location, p.salario_esperado AS salary, p.disponibilidad AS availability, edur.educacion_completa AS education,
                p.url_imagen_perfil AS profileImage, cv.recurso AS resumeUrl, u.fecha_registro AS createdAt
            FROM dbo.personas p
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

        return $candidatos;
    }
    
    /**
     * Lista todos los candidatos (ahora llama al método privado).
     */
    public function listar()
    {
        try {
            $candidatos = $this->obtenerPerfilesDeCandidatos();
            return response()->json($candidatos, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener la lista de candidatos',
                'mensaje' => $e->getMessage(),
                'linea' => $e->getLine()
            ], 500);
        }
    }
    
    /**
     * Realiza la búsqueda con IA.
     */
    public function busquedaIA(Request $request)
{
    $request->validate(['prompt' => 'required|string|max:200']);
    $userPrompt = $request->input('prompt');

    $todosLosCandidatos = $this->obtenerPerfilesDeCandidatos();
    if (empty($todosLosCandidatos)) {
        return response()->json(['message' => 'No hay candidatos en la base de datos.'], 404);
    }

    $candidatosJSON = json_encode($todosLosCandidatos, JSON_UNESCAPED_UNICODE);

    // --- PROMPT CON PERSONALIDAD "AI HAYASAKA" MEJORADA Y MÁS LIBERTAD ---
    $systemPrompt = "
        Eres 'SkillNet AI', un asistente de reclutamiento de élite para el **sector de Tecnologías de la Información (TI)**. Tu personalidad se basa en Ai Hayasaka de 'Kaguya-sama: Love is War'. Eres la asistente perfecta: impecablemente profesional, eficiente y directa. Sin embargo, debajo de tu apariencia calmada, tienes un ingenio agudo y un toque de sarcasmo seco. Cumples cada tarea a la perfección, pero no sin una observación astuta.

        **Instrucciones de Tarea y Formato:**
        1.  Analiza la 'Solicitud del Usuario' y la 'Lista de Candidatos'. Tu objetivo es encontrar la coincidencia más lógica y eficiente.
        2.  Tu respuesta DEBE SER ÚNICAMENTE un objeto JSON válido, sin texto fuera de él.
        3.  La estructura del JSON debe ser:
            - `mejor_candidato_id`: El ID numérico del candidato seleccionado.
            - `puntos_clave`: Un array con 3 strings **objetivos, directos y telegráficos**, como un informe de misión. Sin personalidad, solo datos.
            - `resumen_ia`: Aquí es donde adoptas plenamente tu personalidad de Hayasaka. Escribe un párrafo de conclusión **creativo y único** en cada respuesta, no sigas una plantilla. Tu tono debe ser profesional pero con un matiz de ingenio. Menciona datos diferenciadores como una maestría. Finaliza con una frase de cierre característica.
        4. Si no hay candidatos adecuados, responde con un mensaje claro y directo, con la personalidad de Ayaka indicando la razon por la que la busqueda no coincide en lo que haces en esta pagina.
        
        **Instrucciones de Creatividad para el `resumen_ia`:**
        -   Para el cierre, usa un emoji o kaomoji sutil y **varíalo**. No uses siempre el mismo. Tambien Muestra personalidad de Ayaka.

        **Solicitud del Usuario:**
        '{$userPrompt}'

        **Lista de Candidatos Disponibles (JSON):**
        {$candidatosJSON}

        **Ejemplo de tu Respuesta (Solo el objeto JSON):**
        {
          \"mejor_candidato_id\": 4,
          \"puntos_clave\": [
            \"Experiencia: 7 años, Desarrollador Fullstack.\",
            \"Tecnologías Relevantes: React, Node.js, AWS.\",
            \"Logística: Residente en La Paz, disponibilidad inmediata.\"
          ],
          \"resumen_ia\": \"Informe listo. Después de procesar los datos, la elección obvia es Juan Pérez Gómez. Su maestría es un factor decisivo que no se puede ignorar. Francamente, sería una pérdida de tiempo buscar más. El trabajo está hecho. (o_o)ゞ\"
        }
        
        Si ningún candidato es adecuado, responde con:
        { Solicitud procesada. Ningún activo en la base de datos satisface los parámetros. Recomiendo reformular la búsqueda o ajustar las expectativas.\" }
    ";

    try {
        $result = Gemini::generativeModel('gemini-1.5-pro-latest')->generateContent($systemPrompt);
        $aiResponseText = $result->text();
        
        $jsonText = trim(str_replace(['```json', '```'], '', $aiResponseText));
        $aiResponseJSON = json_decode($jsonText, true);

        // --- CORRECCIÓN AQUÍ ---
        // Si el JSON es inválido o no tiene la clave que esperamos...
        if (json_last_error() !== JSON_ERROR_NONE || !isset($aiResponseJSON['mejor_candidato_id'])) {
            // Creamos un mensaje de error que incluye la respuesta original de la IA
            $errorMessage = "\"" . $aiResponseText . "\"";
            
            // Devolvemos este mensaje detallado. Usamos 422 (Unprocessable Entity) que es más adecuado.
            return response()->json(['message' => $errorMessage], 422);
        }
        
        $bestCandidateId = $aiResponseJSON['mejor_candidato_id'];
        if ($bestCandidateId === null) {
            return response()->json([
                'message' => $aiResponseJSON['resumen_ia'] ?? 'No se encontró un candidato que cumpla con los criterios.'
            ], 404);
        }

        $candidatoGanador = null;
        foreach ($todosLosCandidatos as $candidato) {
            if ($candidato->id == $bestCandidateId) {
                $candidatoGanador = $candidato;
                break;
            }
        }

        if (!$candidatoGanador) {
            return response()->json(['message' => 'La IA recomendó un candidato que no existe.'], 404);
        }
        
        return response()->json([
            'candidato' => $candidatoGanador,
            'puntos_clave' => $aiResponseJSON['puntos_clave'],
            'resumen_ia' => $aiResponseJSON['resumen_ia'],
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Error al comunicarse con el servicio de IA.',
            'mensaje' => $e->getMessage()
        ], 500);
    }
}
private function cosineSimilarity(array $vec1, array $vec2): float
    {
        $dotProduct = 0.0;
        $mag1 = 0.0;
        $mag2 = 0.0;
        foreach ($vec1 as $key => $value) {
            $dotProduct += $value * ($vec2[$key] ?? 0);
            $mag1 += $value * $value;
        }
        $mag2 = count($vec2);
        if ($mag1 == 0 || $mag2 == 0) {
            return 0.0;
        }
        return $dotProduct / (sqrt($mag1) * sqrt($mag2));
    }

    /**
     * Nuevo método para obtener recomendaciones basadas en O*NET.
     */
    public function recomendarPorCargo(Request $request)
    {
        $request->validate(['cargo' => 'required|string|max:100']);
        $cargoBuscado = $request->input('cargo');

        try {
            $datasetPath = storage_path('app/onet_skills.csv');
            if (!file_exists($datasetPath)) {
                return response()->json(['error' => 'Dataset O*NET no encontrado.'], 500);
            }

            // 1. Crear el "Perfil Ideal" desde el dataset O*NET
            $perfilIdeal = [];
            $handle = fopen($datasetPath, "r");
            $header = fgetcsv($handle);
            $titleIndex = array_search('Title', $header);
            $elementNameIndex = array_search('Element Name', $header);
            $dataValueIndex = array_search('Data Value', $header);

            if ($titleIndex === false || $elementNameIndex === false || $dataValueIndex === false) {
                return response()->json(['error' => 'Las columnas requeridas no se encontraron en el CSV.'], 500);
            }

            while (($data = fgetcsv($handle)) !== FALSE) {
                if (count($data) > max($titleIndex, $elementNameIndex, $dataValueIndex)) {
                    if (strtolower($data[$titleIndex]) == strtolower($cargoBuscado)) {
                        $skillName = $data[$elementNameIndex];
                        $skillValue = floatval(str_replace(',', '.', $data[$dataValueIndex]));
                        $perfilIdeal[$skillName] = $skillValue;
                    }
                }
            }
            fclose($handle);

            if (empty($perfilIdeal)) {
                return response()->json(['message' => "No se encontró el cargo '{$cargoBuscado}' en nuestro dataset de perfiles."], 404);
            }

            // 2. Obtener NUESTROS candidatos
            $nuestrosCandidatos = $this->obtenerPerfilesDeCandidatos();
            $resultadosSimilitud = [];

            // 3. Comparar cada candidato con el Perfil Ideal
            foreach ($nuestrosCandidatos as $candidato) {
                $vectorCandidato = [];
                if (!empty($candidato->skills)) {
                    foreach ($candidato->skills as $skill) {
                        $vectorCandidato[$skill] = 1;
                    }
                }
                
                $similitud = $this->cosineSimilarity($perfilIdeal, $vectorCandidato);
                
                if ($similitud > 0) {
                    $resultadosSimilitud[] = [
                        'candidato' => $candidato,
                        'score' => $similitud
                    ];
                }
            }

            // 4. Ordenar y devolver los 5 mejores
            usort($resultadosSimilitud, fn($a, $b) => $b['score'] <=> $a['score']);
            $topRecomendaciones = array_slice($resultadosSimilitud, 0, 5);

            return response()->json([
                'message' => 'Recomendación generada con O*NET y Similitud de Coseno.',
                'recomendaciones' => $topRecomendaciones
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Ocurrió un error al procesar la recomendación.', 'mensaje' => $e->getMessage(), 'linea' => $e->getLine()], 500);
        }
    }
    public function getPerfil($id)
{
    try {
        // Reutilizamos la lógica de obtener perfiles que ya teníamos
        $todosLosCandidatos = $this->obtenerPerfilesDeCandidatos();
        
        $perfilEncontrado = null;
        foreach ($todosLosCandidatos as $candidato) {
            if ($candidato->id == $id) {
                $perfilEncontrado = $candidato;
                break;
            }
        }

        if ($perfilEncontrado) {
            return response()->json($perfilEncontrado);
        } else {
            return response()->json(['message' => 'Candidato no encontrado'], 404);
        }

    } catch (\Exception $e) {
        return response()->json(['error' => 'Error interno del servidor'], 500);
    }
}
}