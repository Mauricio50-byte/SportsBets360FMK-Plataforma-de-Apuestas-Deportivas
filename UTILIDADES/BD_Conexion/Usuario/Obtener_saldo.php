<?php
// Permitir CORS para desarrollo local
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Iniciar sesión
session_start();

// Verificar si hay un usuario en sesión
if (isset($_SESSION['usuario_id'])) {
    $idUsuario = $_SESSION['usuario_id'];
    
    // Incluir el controlador de usuario
    // Corrige la ruta para que apunte correctamente a tu controlador
    require_once(__DIR__ . '/../CONTROLADOR/ControladorUsuario.php');
    
    // Crear instancia del controlador
    $controladorUsuario = new ControladorUsuario();
    
    // Obtener el saldo del usuario
    $saldo = $controladorUsuario->obtenerSaldoUsuario($idUsuario);
    
    // Enviar la respuesta como JSON
    header('Content-Type: application/json');
    echo json_encode(['saldo' => $saldo]);
} else {
    // No hay usuario en sesión
    header('Content-Type: application/json');
    echo json_encode(['error' => 'No hay usuario en sesión', 'saldo' => 0]);
}
?>