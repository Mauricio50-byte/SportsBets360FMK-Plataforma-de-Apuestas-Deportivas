<?php
// Iniciar buffer de salida para evitar "headers already sent"
ob_start();

// Iniciar sesión
session_start();

// Configurar la salida de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); // Reportar todos los errores

// Función para manejar errores de manera controlada
function manejarError($mensaje, $detalle = '') {
    error_log("Error en procesar_retiro.php: $mensaje - $detalle");
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => $mensaje]);
    exit;
}

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    manejarError('Método no permitido');
}

// Para depuración, registrar los datos recibidos
error_log("Datos POST recibidos: " . print_r($_POST, true));
error_log("Datos de sesión disponibles: " . (isset($_SESSION['usuario']) ? 'Sí' : 'No'));
if (isset($_SESSION['usuario'])) {
    error_log("ID usuario en sesión: " . (isset($_SESSION['usuario']['ID']) ? $_SESSION['usuario']['ID'] : 'No disponible'));
    error_log("Saldo en sesión: " . (isset($_SESSION['usuario']['saldo']) ? $_SESSION['usuario']['saldo'] : 'No disponible'));
}

// Obtener los datos del formulario usando isset para compatibilidad con versiones antiguas de PHP
$datosRetiro = [
    'id_transaccion' => isset($_POST['id_transaccion']) ? trim($_POST['id_transaccion']) : '',
    'fecha' => isset($_POST['fecha']) ? trim($_POST['fecha']) : date('Y-m-d'),
    'usuario' => isset($_POST['usuario']) ? trim($_POST['usuario']) : '',
    'documento' => isset($_POST['documento']) ? trim($_POST['documento']) : '',
    'correo' => isset($_POST['correo']) ? trim($_POST['correo']) : '',
    'monto' => isset($_POST['monto']) ? trim($_POST['monto']) : 0,
    'cuenta_destino' => isset($_POST['cuenta_destino']) ? trim($_POST['cuenta_destino']) : '' // Cuenta destino para el retiro
];

// Si el usuario no está en los datos POST pero sí en la sesión, usarlo desde la sesión
if (empty($datosRetiro['usuario']) && isset($_SESSION['usuario']) && isset($_SESSION['usuario']['ID'])) {
    $datosRetiro['usuario'] = $_SESSION['usuario']['ID'];
    error_log("Usando ID de usuario desde la sesión: " . $datosRetiro['usuario']);
}

// Si el documento o correo no están en los datos POST pero sí en la sesión, usarlos desde la sesión
if (empty($datosRetiro['documento']) && isset($_SESSION['usuario']) && isset($_SESSION['usuario']['numero_documento'])) {
    $datosRetiro['documento'] = $_SESSION['usuario']['numero_documento'];
}

if (empty($datosRetiro['correo']) && isset($_SESSION['usuario']) && isset($_SESSION['usuario']['correo'])) {
    $datosRetiro['correo'] = $_SESSION['usuario']['correo'];
}

// Validar que exista un usuario
if (empty($datosRetiro['usuario'])) {
    manejarError('El nombre de usuario es obligatorio');
}

// Validar que el monto sea un número positivo
if (!is_numeric($datosRetiro['monto']) || floatval($datosRetiro['monto']) <= 0) {
    manejarError('El monto debe ser un valor numérico positivo');
}

try {
    // Incluir el controlador
    $controladorPath = $_SERVER['DOCUMENT_ROOT'] . '/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/CONTROLADORES/ControladorRecargaRetiro.php';
    
    if (!file_exists($controladorPath)) {
        manejarError('Error de ruta', "No se encuentra el archivo: $controladorPath");
    }
    
    require_once $controladorPath;
    
    // Verificar que la clase existe
    if (!class_exists('ControladorRecargaRetiro')) {
        manejarError('Error al cargar el controlador', 'La clase ControladorRecargaRetiro no está definida');
    }
    
    // Crear instancia del controlador
    $controlador = new ControladorRecargaRetiro();
    
    // Depuración - Mostrar datos iniciales
    error_log("Usuario original: " . $datosRetiro['usuario']);
    
    // Convertir nombre de usuario a ID si no es numérico
    if (!is_numeric($datosRetiro['usuario'])) {
        // En lugar de usar buscarUsuarioPorNombre, intentaremos pasar el nombre directamente
        // al controlador de procesarRetiro para que maneje la lógica de búsqueda
        
        // Asegurarnos de que tenemos al menos documento y correo si están en sesión
        if (empty($datosRetiro['documento']) && isset($_SESSION['usuario']) && isset($_SESSION['usuario']['numero_documento'])) {
            $datosRetiro['documento'] = $_SESSION['usuario']['numero_documento'];
        }
        
        if (empty($datosRetiro['correo']) && isset($_SESSION['usuario']) && isset($_SESSION['usuario']['correo'])) {
            $datosRetiro['correo'] = $_SESSION['usuario']['correo'];
        }
        
        // Reemplazar comillas y realizar otras sanitizaciones simples
        $datosRetiro['usuario'] = str_replace(["'", "\"", "\\", ";"], "", $datosRetiro['usuario']);
        
        // Solo depuración
        error_log("Usando nombre de usuario: " . $datosRetiro['usuario']);
    }
    
    // Procesar el retiro
    $resultado = $controlador->procesarRetiro($datosRetiro);
    
    // Si el retiro fue exitoso y el usuario está autenticado, actualizar el saldo en la sesión
    if ($resultado['status'] === 'success' && isset($_SESSION['usuario'])) {
        if (!isset($_SESSION['usuario']['saldo'])) {
            $_SESSION['usuario']['saldo'] = 0;
        }
        $_SESSION['usuario']['saldo'] -= (float)$datosRetiro['monto'];
        error_log("Saldo actualizado en sesión: " . $_SESSION['usuario']['saldo']);
        
        // Agregar información adicional para mostrar al usuario
        $resultado['saldo_actualizado'] = $_SESSION['usuario']['saldo'];
        $resultado['fecha_procesamiento'] = date('Y-m-d H:i:s');
    }
    
    // Devolver respuesta como JSON
    header('Content-Type: application/json');
    echo json_encode($resultado);
    
} catch (Exception $e) {
    manejarError('Error al procesar el retiro', $e->getMessage());
} finally {
    // Liberar el buffer de salida
    ob_end_flush();
}
?>