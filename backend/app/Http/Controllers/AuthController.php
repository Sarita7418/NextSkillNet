<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;



class AuthController extends Controller
{
    //Metodo del Login
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

    //Metodo del Registro

    public function register(Request $request)
    {
        try {
            // Validación básica
            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string',
                'apellido' => 'required|string',
                'fechaNacimiento' => 'required|date',
                'genero' => 'required|string',
                'estadoEmpleado' => 'required|in:0,1',
                'correo' => 'required|email',
                'contraseña' => 'required|string|min:4'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Datos inválidos',
                    'message' => $validator->errors()
                ], 400);
            }

            // Buscar el ID del género (subdominios.descripcion = genero)
            $id_genero = DB::table('subdominios')
                ->where('descripcion', strtolower($request->genero))
                ->whereIn('idPadre', function ($query) {
                    $query->select('idPadre')->from('dominios')->where('descripcion', 'generos');
                })
                ->value('id');

            if (!$id_genero) {
                return response()->json(['message' => 'Género inválido'], 400);
            }

            // Insertar en personas
            $id_persona = DB::table('personas')->insertGetId([
                'nombre' => $request->nombre,
                'apellido' => $request->apellido,
                'fecha_nacimiento' => $request->fechaNacimiento,
                'id_genero' => $id_genero,
                'estado_empleado' => $request->estadoEmpleado
            ]);

            // Insertar en correo
            DB::table('correo')->insert([
                'descripcion' => $request->correo,
                'id_persona' => $id_persona
            ]);

            // Insertar en usuarios
            DB::table('usuarios')->insert([
                'contrasena' => $request->contraseña,
                'fecha_registro' => now(),
                'id_persona' => $id_persona,
                'id_rol' => 1 // 1 = postulante
            ]);

            return response()->json([
                'message' => 'Registro exitoso',
                'id_persona' => $id_persona
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno',
                'error' => $e->getMessage()
            ], 500);
        }
    }



}