<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\CandidatoController;
use Gemini\Laravel\Facades\Gemini;

class OnetController extends Controller
{
    /**
     * Función de ayuda para calcular la Similitud de Coseno.
     */
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
     * Método principal para obtener recomendaciones basadas en O*NET.
     */
    public function obtenerRecomendacion(Request $request)
    {
        $request->validate(['cargo' => 'required|string|max:100']);
        $cargoBuscadoPorUsuario = $request->input('cargo');

        try {
            $datasetPath = storage_path('app/onet_skills.csv');
            if (!file_exists($datasetPath)) {
                return response()->json(['error' => 'Dataset O*NET no encontrado.'], 500);
            }

            // --- 1. ESTANDARIZAR EL CARGO CON IA ---
            $titulosCsv = array_map('str_getcsv', file($datasetPath));
            array_shift($titulosCsv); // Quitamos el encabezado
            $titulosDisponibles = array_values(array_unique(array_column($titulosCsv, 1)));
            
            $promptEstandarizacion = "Analiza la 'Solicitud de Cargo' y encuentra el equivalente más cercano en la 'Lista de Cargos Oficiales'. Responde ÚNICAMENTE con el texto del cargo oficial. Si no hay ninguno remotamente similar, responde con la palabra 'desconocido'. Solicitud de Cargo: '{$cargoBuscadoPorUsuario}'. Lista de Cargos Oficiales: ".implode(', ', $titulosDisponibles);

            $geminiResponse = Gemini::generativeModel('gemini-1.5-pro-latest')->generateContent($promptEstandarizacion)->text();
            $cargoEstandarizado = trim($geminiResponse);

            if (strtolower($cargoEstandarizado) === 'desconocido' || $cargoEstandarizado === '') {
                return response()->json(['message' => 'No pude identificar un cargo profesional de TI en tu solicitud. Por favor, sé más específico.'], 404);
            }

            // --- 2. CREAR EL "PERFIL IDEAL" DESDE EL DATASET O*NET ---
            $perfilIdeal = [];
            $handle = fopen($datasetPath, "r");
            $header = fgetcsv($handle);
            $titleIndex = array_search('Title', $header);
            $elementNameIndex = array_search('Element Name', $header);
            $dataValueIndex = array_search('Data Value', $header);

            if ($titleIndex === false || $elementNameIndex === false || $dataValueIndex === false) {
                fclose($handle);
                return response()->json(['error' => 'Las columnas requeridas (Title, Element Name, Data Value) no se encontraron en el archivo CSV.'], 500);
            }

            while (($data = fgetcsv($handle)) !== FALSE) {
                if (count($data) > max($titleIndex, $elementNameIndex, $dataValueIndex)) {
                    if (strtolower($data[$titleIndex]) == strtolower($cargoEstandarizado)) {
                        $skillName = $data[$elementNameIndex];
                        $skillValue = floatval(str_replace(',', '.', $data[$dataValueIndex]));
                        $perfilIdeal[$skillName] = $skillValue;
                    }
                }
            }
            fclose($handle);

            if (empty($perfilIdeal)) {
                return response()->json(['message' => "No se encontró el cargo estandarizado '{$cargoEstandarizado}' en nuestro dataset de perfiles."], 404);
            }

            // --- 3. OBTENER NUESTROS CANDIDATOS Y CALCULAR SIMILITUD ---
            $candidatoController = new CandidatoController();
            $nuestrosCandidatos = $candidatoController->obtenerPerfilesDeCandidatos();
            $resultadosSimilitud = [];

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

            // --- 4. ORDENAR Y DEVOLVER LOS MEJORES RESULTADOS ---
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
}