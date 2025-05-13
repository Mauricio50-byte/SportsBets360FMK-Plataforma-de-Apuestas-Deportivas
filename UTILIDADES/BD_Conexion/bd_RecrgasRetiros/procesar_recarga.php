<?php
// Iniciar sesión
session_start();

// Configurar la salida de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); // Reportar todos los errores

// Función para manejar errores de manera controlada
function manejarError($mensaje, $detalle = '') {
    error_log("Error en procesar_recarga.php: $mensaje - $detalle");
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
}

// Obtener los datos del formulario usando isset para compatibilidad con versiones antiguas de PHP
$datosRecarga = [
    'id_transaccion' => isset($_POST['id_transaccion']) ? trim($_POST['id_transaccion']) : '',
    'fecha' => isset($_POST['fecha']) ? trim($_POST['fecha']) : date('Y-m-d'),
    'usuario' => isset($_POST['usuario']) ? trim($_POST['usuario']) : '',
    'documento' => isset($_POST['documento']) ? trim($_POST['documento']) : '',
    'correo' => isset($_POST['correo']) ? trim($_POST['correo']) : '',
    'monto' => isset($_POST['monto']) ? trim($_POST['monto']) : 0
];

// Si el usuario no está en los datos POST pero sí en la sesión, usarlo desde la sesión
if (empty($datosRecarga['usuario']) && isset($_SESSION['usuario']) && isset($_SESSION['usuario']['ID'])) {
    $datosRecarga['usuario'] = $_SESSION['usuario']['ID'];
    error_log("Usando ID de usuario desde la sesión: " . $datosRecarga['usuario']);
}

// Si el documento o correo no están en los datos POST pero sí en la sesión, usarlos desde la sesión
if (empty($datosRecarga['documento']) && isset($_SESSION['usuario']) && isset($_SESSION['usuario']['numero_documento'])) {
    $datosRecarga['documento'] = $_SESSION['usuario']['numero_documento'];
}

if (empty($datosRecarga['correo']) && isset($_SESSION['usuario']) && isset($_SESSION['usuario']['correo'])) {
    $datosRecarga['correo'] = $_SESSION['usuario']['correo'];
}

// Validar que exista un usuario
if (empty($datosRecarga['usuario'])) {
    manejarError('El nombre de usuario es obligatorio');
}

// Validar que el monto sea un número positivo
if (!is_numeric($datosRecarga['monto']) || floatval($datosRecarga['monto']) <= 0) {
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
    
    // Procesar la recarga
    $controlador = new ControladorRecargaRetiro();
    
    // Aquí necesitamos incluir la lógica para buscar el ID del usuario por nombre
    // Asumimos que hay un método en el controlador para hacer esto, si no existe, habrá que crearlo
    if (!is_numeric($datosRecarga['usuario'])) {
        $usuarioInfo = $controlador->buscarUsuarioPorNombre($datosRecarga['usuario']);
        if ($usuarioInfo && isset($usuarioInfo['ID'])) {
            $datosRecarga['nombre_usuario'] = $datosRecarga['usuario']; // Guardar el nombre para referencia
            $datosRecarga['usuario'] = $usuarioInfo['ID']; // Reemplazar con el ID numérico
        } else {
            // Si no se encuentra el usuario, mantener el nombre para que el controlador maneje el error
            // o implementar la búsqueda aquí si es necesario
        }
    }
    
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
    
} catch (Exception $e) {
    manejarError('Error al procesar la recarga', $e->getMessage());
}
?>