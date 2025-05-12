<?php
// Iniciar sesión
session_start();

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

// Para depuración, registrar los datos recibidos
error_log("Datos POST recibidos en retiro: " . print_r($_POST, true));

// Obtener los datos del formulario
$datosRetiro = [
    'id_transaccion' => $_POST['id_transaccion'] ?? '',
    'fecha' => $_POST['fecha'] ?? '',
    'usuario' => $_POST['usuario'] ?? '',
    'documento' => $_POST['documento'] ?? '',
    'correo' => $_POST['correo'] ?? '',
    'monto' => $_POST['monto'] ?? 0
];

// Validar que el monto sea un número positivo
if (!is_numeric($datosRetiro['monto']) || floatval($datosRetiro['monto']) <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'El monto debe ser un valor numérico positivo']);
    exit;
}

// Verificar si el usuario está autenticado y tiene saldo suficiente
if (isset($_SESSION['usuario']) && isset($_SESSION['usuario']['saldo'])) {
    if ((float)$_SESSION['usuario']['saldo'] < (float)$datosRetiro['monto']) {
        echo json_encode(['status' => 'error', 'message' => 'Saldo insuficiente para realizar el retiro']);
        exit;
    }
} else {
    // Si no hay datos de sesión, intentamos verificar con el saldo actual en el front
    // Nota: en producción, esto debería verificarse siempre en el backend
    error_log("No hay datos de saldo en sesión para verificar");
}

// Incluir el controlador
require_once __DIR__ . '/../../../CONTROLADOR/ControladorRecargaRetiro.php';

// Procesar el retiro
$controlador = new ControladorRecargaRetiro();
$resultado = $controlador->procesarRetiro($datosRetiro);

// Si el retiro fue exitoso y el usuario está autenticado, actualizar el saldo en la sesión
if ($resultado['status'] === 'success' && isset($_SESSION['usuario'])) {
    if (!isset($_SESSION['usuario']['saldo'])) {
        $_SESSION['usuario']['saldo'] = 0;
    }
    $_SESSION['usuario']['saldo'] -= (float)$datosRetiro['monto'];
    error_log("Saldo actualizado en sesión después del retiro: " . $_SESSION['usuario']['saldo']);
}

// Devolver respuesta como JSON
header('Content-Type: application/json');
echo json_encode($resultado);
exit;
?>