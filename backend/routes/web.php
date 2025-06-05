<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HabilidadController;
use App\Http\Controllers\IdiomaController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\CuentaController;
use App\Http\Controllers\AdminController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/actualizar', [AuthController::class, 'actualizarDatos']);

// Listar habilidades blandas
Route::get('/habilidades', [HabilidadController::class, 'listar']);

// Listar idiomas
Route::get('/idiomas', [IdiomaController::class, 'listar']);

// Obtener habilidades de un usuario
Route::get('/usuario/{id}/habilidades', [UsuarioController::class, 'getHabilidades']);

// Obtener idiomas de un usuario
Route::get('/usuario/{id}/idiomas', [UsuarioController::class, 'getIdiomas']);

// Guardar habilidades blandas de un usuario
Route::post('/usuario/habilidades', [UsuarioController::class, 'guardarHabilidades']);

// Guardar idiomas de un usuario
Route::post('/usuario/idiomas', [UsuarioController::class, 'guardarIdiomas']);



Route::get('/subdominios/areas', [CuentaController::class, 'getAreas']);
Route::get('/politicos_ubicacion/paises', [CuentaController::class, 'getPaises']);
Route::get('/politicos_ubicacion/ciudades/{idPais}', [CuentaController::class, 'getCiudades']);
Route::post('/usuario/solicitar_representante', [CuentaController::class, 'solicitarRepresentante']);
Route::post('/usuario/actualizar_contrasena', [CuentaController::class, 'actualizarContrasena']);
Route::post('/entrevistas/agendar', [AuthController::class, 'agendarEntrevista']);
Route::get('/entrevistas', [AuthController::class, 'listarEntrevistas']);
Route::post('/convocatorias/crear', [AuthController::class, 'crearConvocatoria']);
Route::get('/convocatorias', [AuthController::class, 'listarConvocatorias']);

// routes/api.php
Route::get('/admin/usuarios', [AdminController::class, 'listarUsuarios']);

// Endpoint para obtener todos los datos de una persona (usuario + persona + correos)
Route::get('/usuario/completo/{id}', [AuthController::class, 'perfil']);

// Nueva ruta para eliminar un usuario completo (persona + correos + cuenta)
Route::delete('/admin/eliminar/{id}', [AdminController::class, 'eliminarUsuario']);

// Si está en AdminController
Route::post('/admin/anadir', [AuthController::class, 'anadirAdmin']);

Route::post('/usuario/registrar_empresa', [CuentaController::class, 'registrarEmpresa']);

Route::post('/admin/aprobar-representante', [AdminController::class, 'aprobarRepresentante']);






Route::get('/', function () {
    return view('welcome');
});

//para subir archivos
Route::post('/subir-curriculum', [AuthController::class, 'subirCurriculum']);
