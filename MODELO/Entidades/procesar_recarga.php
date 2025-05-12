<?php
// Iniciar sesión
session_start();

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

// Verificar si el usuario está autenticado
if (!isset($_SESSION['usuario'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['status' => 'error', 'message' => 'Usuario no autenticado']);
    exit;
}

// Incluir el controlador
require_once __DIR__ . '/../CONTROLADOR/ControladorRecargaRetiro.php';

// Obtener los datos del formulario
$datosRecarga = [
    'usuario' => $_POST['usuario'] ?? '',
    'documento' => $_POST['documento'] ?? '',
    'correo' => $_POST['correo'] ?? '',
    'monto' => $_POST['monto'] ?? 0
];

// Procesar la recarga
$controlador = new ControladorRecargaRetiro();
$resultado = $controlador->procesarRecarga($datosRecarga);

// Si la recarga fue exitosa, actualizar el saldo en la sesión
if ($resultado['status'] === 'success' && isset($_SESSION['usuario']['saldo'])) {
    $_SESSION['usuario']['saldo'] += (float)$datosRecarga['monto'];
}

// Devolver respuesta como JSON
header('Content-Type: application/json');
echo json_encode($resultado);
exit;
?>