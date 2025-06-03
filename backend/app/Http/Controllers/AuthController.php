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
        // Validación con el nombre correcto de campos
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string',
            'contrasena' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Datos incorrectos',
                'message' => $validator->errors()
            ], 400);
        }

        // Buscar persona por nombre (sin tilde)
        $persona = DB::table('personas')
            ->whereRaw('LOWER(nombre) = ?', [strtolower($request->nombre)])
            ->first();

        if (!$persona) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Buscar usuario con la contraseña correcta (sin tilde)
        $usuario = DB::table('usuarios')
            ->where('id_persona', $persona->id_persona)
            ->where('contrasena', $request->contrasena)
            ->first();

        if (!$usuario) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        // Obtener correos
        $correos = DB::table('correo')
            ->where('id_persona', $persona->id_persona)
            ->pluck('descripcion');

        // Construir usuario completo para enviar al frontend
        $usuarioCompleto = [
            'id_usuario' => $usuario->id_usuario,
            'nombre' => $persona->nombre,
            'apellido' => $persona->apellido,
            'fecha_nacimiento' => $persona->fecha_nacimiento,
            'id_genero' => $persona->id_genero,
            'estado_empleado' => $persona->estado_empleado,
            'correos' => $correos,
            'id_rol' => $usuario->id_rol,
        ];

        return response()->json([
            'message' => 'Login exitoso',
            'usuario' => $usuarioCompleto
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

    //Actualizar datos de usuario

    public function actualizarDatos(Request $request)
{
    try {
        $request->validate([
            'id_usuario' => 'required|integer',
            'nombre' => 'required|string',
            'apellido' => 'required|string',
            'correo' => 'required|email',
            'fecha_nacimiento' => 'required|date',
            'genero' => 'required|integer',
            'estado_empleado' => 'required|in:0,1',
        ]);

        $usuario = DB::table('usuarios')->where('id_usuario', $request->id_usuario)->first();
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $persona = DB::table('personas')->where('id_persona', $usuario->id_persona)->first();
        if (!$persona) {
            
            return response()->json(['message' => 'Persona no encontrada'], 404);
        }

        DB::table('personas')->where('id_persona', $persona->id_persona)->update([
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'fecha_nacimiento' => $request->fecha_nacimiento,
            'id_genero' => $request->genero,
            'estado_empleado' => $request->estado_empleado,
        ]);

        $updated = DB::table('correo')->where('id_persona', $persona->id_persona)->update([
            'descripcion' => $request->correo,
        ]);

        if ($updated === 0) {

        }

        return response()->json(['message' => 'Datos actualizados correctamente']);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error interno',
            'error' => $e->getMessage()
        ], 500);
    }
}

}