<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\CandidatoController; // Para reutilizar la lógica de obtener perfiles

class OnetController extends Controller
{
    // Función de ayuda para calcular la Similitud de Coseno
    private function cosineSimilarity(array $vec1, array $vec2): float
    {
        $dotProduct = 0.0;
        $mag1 = 0.0;
        $mag2 = 0.0;

        foreach ($vec1 as $key => $value) {
            $dotProduct += $value * ($vec2[$key] ?? 0); // Multiplica si la clave existe en el vector 2
            $mag1 += $value * $value;
        }

        foreach ($vec2 as $key => $value) {
            $mag2 += $value * $value;
        }

        if ($mag1 == 0 || $mag2 == 0) {
            return 0.0;
        }

        return $dotProduct / (sqrt($mag1) * sqrt($mag2));
    }

    public function obtenerRecomendacion(Request $request)
    {
        $request->validate(['cargo' => 'required|string']);
        $cargoBuscado = $request->input('cargo'); // Ej: "Software Developers"

        try {
            // --- 1. Crear el "Perfil Ideal" desde el dataset O*NET ---
            $datasetPath = storage_path('app/onet_skills.csv');
            $perfilIdeal = [];

            if (($handle = fopen($datasetPath, "r")) !== FALSE) {
                fgetcsv($handle); // Omitir la fila de encabezado
                while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                    // Asumimos que la columna 'Title' es la 1, 'Element Name' es la 3, y 'Data Value' es la 6
                    $title = $data[1];
                    $skillName = $data[3];
                    $skillValue = floatval(str_replace(',', '.', $data[6])); // Reemplazar comas por puntos para decimales

                    if (strtolower($title) == strtolower($cargoBuscado)) {
                        $perfilIdeal[$skillName] = $skillValue;
                    }
                }
                fclose($handle);
            }

            if (empty($perfilIdeal)) {
                return response()->json(['message' => 'No se encontró el cargo en nuestro dataset de perfiles.'], 404);
            }

            // --- 2. Obtener NUESTROS candidatos de la base de datos ---
            $candidatoController = new CandidatoController();
            $nuestrosCandidatos = $candidatoController->obtenerPerfilesDeCandidatos();
            
            $resultadosSimilitud = [];

            // --- 3. Comparar cada uno de nuestros candidatos con el Perfil Ideal ---
            foreach ($nuestrosCandidatos as $candidato) {
                // Crear el vector de habilidades para nuestro candidato (1 si tiene la habilidad, 0 si no)
                $vectorCandidato = [];
                foreach ($candidato->skills as $skill) {
                    $vectorCandidato[$skill] = 1;
                }
                
                // Calculamos la similitud entre el candidato y el perfil ideal
                $similitud = $this->cosineSimilarity($perfilIdeal, $vectorCandidato);
                
                if ($similitud > 0) { // Solo consideramos candidatos con al menos una habilidad en común
                    $resultadosSimilitud[] = [
                        'candidato' => $candidato,
                        'score' => $similitud
                    ];
                }
            }

            // --- 4. Ordenar los candidatos por el puntaje de similitud (de mayor a menor) ---
            usort($resultadosSimilitud, function ($a, $b) {
                return $b['score'] <=> $a['score'];
            });

            // --- 5. Devolver los 5 mejores resultados ---
            $topRecomendaciones = array_slice($resultadosSimilitud, 0, 5);

            return response()->json([
                'message' => 'Recomendación generada con O*NET y Similitud de Coseno.',
                'recomendaciones' => $topRecomendaciones
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Ocurrió un error al procesar la recomendación.', 'mensaje' => $e->getMessage()], 500);
        }
    }
}