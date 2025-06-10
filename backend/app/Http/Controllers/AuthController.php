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
    //Metodo del chat
    public function agendarEntrevista(Request $request) {
    try {
        // Validación
        $validator = Validator::make($request->all(), [
            'empresa' => 'required|string|max:100',
            'fecha' => 'required|date',
            'hora' => 'required|date_format:H:i',
            'id_usuario' => 'required|exists:usuarios,id' // Asegura que el usuario existe
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Datos inválidos',
                'message' => $validator->errors()
            ], 400);
        }

        // Insertar en tabla entrevistas
        $id_entrevista = DB::table('entrevistas')->insertGetId([
            'id_empresa' => $this->getEmpresaId($request->empresa), // Función auxiliar para obtener ID
            'id_usuario' => $request->id_usuario,
            'fecha' => $request->fecha,
            'hora' => $request->hora,
            'estado' => 'pendiente',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json([
            'message' => 'Entrevista agendada con éxito',
            'id_entrevista' => $id_entrevista
        ], 201);

        } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error al agendar entrevista',
            'error' => $e->getMessage()
        ], 500);
        }
    }
    
    //Metodo del convocatoria

    public function crearConvocatoria(Request $request) {
        try {
            // Validación
            $validator = Validator::make($request->all(), [
                'titulo' => 'required|string|max:255',
                'descripcion' => 'required|string',
                'fecha_limite' => 'required|date',
                'id_empresa' => 'required|exists:empresas,id', // Asegura que la empresa existe
                'id_usuario' => 'required|exists:usuarios,id' // Asegura que el usuario existe
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Datos inválidos',
                    'message' => $validator->errors()
                ], 400);
            }

            // Insertar en tabla convocatorias
            $id_convocatoria = DB::table('convocatorias')->insertGetId([
                'titulo' => $request->titulo,
                'descripcion' => $request->descripcion,
                'fecha_limite' => $request->fecha_limite,
                'id_empresa' => $request->id_empresa,
                'id_usuario' => $request->id_usuario,
                'estado' => 'abierta',
                'created_at' => now(),
                'updated_at' => now()
            ]);

            return response()->json([
                'message' => 'Convocatoria creada con éxito',
                'id_convocatoria' => $id_convocatoria
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear convocatoria',
                'error' => $e->getMessage()
            ], 500);
        }
    public function listarConvocatorias() {
        try {
            $convocatorias = DB::table('convocatorias')
                ->join('empresas', 'convocatorias.id_empresa', '=', 'empresas.id')
                ->select('convocatorias.*', 'empresas.nombre as empresa')
                ->where('convocatorias.estado', 'activa')
                ->get();

            return response()->json([
                'data' => $convocatorias
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener convocatorias',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    }
}