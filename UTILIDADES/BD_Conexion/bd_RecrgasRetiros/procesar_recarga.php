<?php
// Iniciar sesión
session_start();

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

// Incluir el controlador
require_once __DIR__ . '/../../../CONTROLADOR/ControladorRecargaRetiro.php';

// Para depuración, registrar los datos recibidos
error_log("Datos POST recibidos: " . print_r($_POST, true));

// Obtener los datos del formulario
$datosRecarga = [
    'id_transaccion' => $_POST['id_transaccion'] ?? '',
    'fecha' => $_POST['fecha'] ?? '',
    'usuario' => $_POST['usuario'] ?? '',
    'documento' => $_POST['documento'] ?? '',
    'correo' => $_POST['correo'] ?? '',
    'monto' => $_POST['monto'] ?? 0
];

// Validar que el monto sea un número positivo
if (!is_numeric($datosRecarga['monto']) || floatval($datosRecarga['monto']) <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'El monto debe ser un valor numérico positivo']);
    exit;
}

// Procesar la recarga
$controlador = new ControladorRecargaRetiro();
$resultado = $controlador->procesarRecarga($datosRecarga);

// Si la recarga fue exitosa y el usuario está autenticado, actualizar el saldo en la sesión
if ($resultado['status'] === 'success' && isset($_SESSION['usuario'])) {
    if (!isset($_SESSION['usuario']['saldo'])) {
        $_SESSION['usuario']['saldo'] = 0;
    }
    $_SESSION['usuario']['saldo'] += (float)$datosRecarga['monto'];
    error_log("Saldo actualizado en sesión: " . $_SESSION['usuario']['saldo']);
}

// Devolver respuesta como JSON
header('Content-Type: application/json');
echo json_encode($resultado);
exit;
?>