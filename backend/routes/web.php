<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HabilidadController;
use App\Http\Controllers\IdiomaController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\CuentaController;
use App\Http\Controllers\DocumentoController;

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

Route::get('/', function () {
    return view('welcome');
});

//para subir archivos
Route::post('/documentos', [DocumentoController::class, 'upload'])->middleware('auth');
Route::get('/documentos/{id_persona}', [DocumentoController::class, 'listarPorUsuario']);
Route::delete('/documentos/{id}', [DocumentoController::class, 'eliminar']);
