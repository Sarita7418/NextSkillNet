<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;



class AuthController extends Controller
{
    public function login(Request $request)
    {

        try {
            // Validación básica
            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string',
                'contraseña' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Datos incorrectos',
                    'message' => $validator->errors()
                ], 400);
            }

            // Buscar persona por nombre
            $persona = DB::table('personas')
                ->whereRaw('LOWER(nombre) = ?', [strtolower($request->nombre)])
                ->first();

            if (!$persona) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            // Buscar usuario asociado con esa persona y esa contraseña
            $usuario = DB::table('usuarios')
                ->where('id_persona', $persona->id_persona)
                ->where('contrasena', $request->contraseña)
                ->first();

            if (!$usuario) {
                return response()->json(['message' => 'Credenciales incorrectas'], 401);
            }

            return response()->json([
                'message' => 'Login exitoso',
                'persona' => $persona,
                'usuario' => $usuario
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno',
                'error' => $e->getMessage()
            ], 500);
        }

    }
}