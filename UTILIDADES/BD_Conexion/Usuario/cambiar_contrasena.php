<?php
/**
 * Script para cambiar la contraseña del usuario
 */

// Iniciar sesión
session_start();

// Establecer encabezados para CORS y respuesta JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Permitir peticiones preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Verificar si hay una sesión activa
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'No hay sesión activa'
    ]);
    exit;
}

// Verificar si es una petición POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener y decodificar datos JSON
    $jsonData = file_get_contents('php://input');
    $datos = json_decode($jsonData, true);
    
    if (!$datos || !isset($datos['contrasena_actual']) || !isset($datos['nueva_contrasena'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Datos inválidos'
        ]);
        exit;
    }
    
    try {
        // Determinar la ruta base para incluir correctamente los archivos
        $rutaBase = $_SERVER['DOCUMENT_ROOT'] . '/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/';
        
        // Incluir el modelo de persistencia de usuarios
        $rutaPersistencia = $rutaBase . 'MODELO/Persistencia/UsuarioPersistencia.php';
        
        // Verificar si el archivo existe antes de incluirlo
        if (!file_exists($rutaPersistencia)) {
            echo json_encode([
                'success' => false,
                'message' => 'Error: No se encontró el modelo de persistencia en: ' . $rutaPersistencia
            ]);
            exit;
        }
        
        // Incluir la clase de persistencia
        require_once($rutaPersistencia);
        
        // Crear una instancia de la clase UsuarioPersistencia
        $usuarioPersistencia = new UsuarioPersistencia();
        
        // Llamamos directamente al método cambiarContrasena de la clase UsuarioPersistencia
        // Este método ya maneja la verificación de la contraseña actual y la actualización
        $resultado = $usuarioPersistencia->cambiarContrasena(
            $_SESSION['usuario_id'], 
            $datos['contrasena_actual'], 
            $datos['nueva_contrasena']
        );
        
        // Verificar resultado
        if ($resultado === true) {
            echo json_encode([
                'success' => true,
                'message' => 'Contraseña actualizada correctamente'
            ]);
        } else {
            // Si no es true, el método devuelve un mensaje de error
            echo json_encode([
                'success' => false,
                'message' => $resultado
            ]);
        }
    } catch (Exception $e) {
        error_log("Error en cambiar_contrasena.php: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?>