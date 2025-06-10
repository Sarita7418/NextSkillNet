<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HabilidadController;
use App\Http\Controllers\IdiomaController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\CuentaController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CandidatoController;
use App\Http\Controllers\FiltroController;
use App\Http\Controllers\RecomendacionController;
use App\Http\Controllers\OnetController;
use App\Http\Controllers\UploadController;
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
// En routes/web.php
Route::post('/candidatos/recomendar-cargo', [App\Http\Controllers\CandidatoController::class, 'recomendarPorCargo']);
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

// Nueva ruta para listar candidatos
Route::get('/candidatos', [CandidatoController::class, 'listar']);
// Nueva ruta para obtener las opciones de los filtros
Route::get('/filtros/opciones', [FiltroController::class, 'getOpciones']);

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

Route::post('/candidatos/busqueda-ia', [CandidatoController::class, 'busquedaIA']);


Route::post('/usuario/registrar_empresa', [CuentaController::class, 'registrarEmpresa']);

Route::post('/admin/aprobar-representante', [AdminController::class, 'aprobarRepresentante']);

Route::post('/admin/empresa/anadir', [AdminController::class, 'anadirEmpresa']);



Route::get('/admin/empresas', [AdminController::class, 'listarEmpresasConRepresentantes']);

Route::post('/admin/empresa/actualizar', [AdminController::class, 'actualizarEmpresa']);


Route::get('/chats/listar', [ChatController::class, 'listarChats']);

Route::get('/chats/{id_chat}/mensajes', [ChatController::class, 'mensajesPorChat']);

Route::post('/chats/mensajes/agregar', [ChatController::class, 'agregarMensaje']);



Route::post('/candidatos/recomendacion-knn', [RecomendacionController::class, 'obtenerRecomendaciones']);

Route::post('/candidatos/recomendacion-onet', [OnetController::class, 'obtenerRecomendacion']);

Route::get('/', function () {
    return view('welcome');
});

//para subir archivos
Route::post('/subir-curriculum', [AuthController::class, 'subirCurriculum']);

Route::post('/upload', [UploadController::class, 'upload']);


// Rutas para experiencia laboral
// Rutas para experiencia laboral
Route::get('/usuario/{id}/experiencias-laborales', [UsuarioController::class, 'getExperienciasLaborales']);
Route::post('/usuario/{id_usuario}/experiencias-laborales', [UsuarioController::class, 'storeExperienciaLaboral']);
Route::put('/usuario/{id_usuario}/experiencias-laborales/{id_experiencia_laboral}', [UsuarioController::class, 'updateExperienciaLaboral']);
Route::delete('/usuario/{id_usuario}/experiencias-laborales/{id_experiencia_laboral}', [UsuarioController::class, 'destroyExperienciaLaboral']);