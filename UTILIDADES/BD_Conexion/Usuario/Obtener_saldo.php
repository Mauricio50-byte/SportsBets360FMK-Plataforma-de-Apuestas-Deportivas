<?php
/**
 * Obtener_saldo.php
 * Script para obtener el saldo actual del usuario desde la base de datos
 */

// Configurar headers para JSON y CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Accept');

// Iniciar sesión
session_start();

// Configuración de la base de datos
$host = "localhost";
$db = "bd_pltf_apuestas";
$usuario = "root";
$password = "";
$charset = "utf8mb4";

// Función para enviar respuesta JSON
function enviarRespuesta($status, $message, $saldo = 0, $usuario = null) {
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'saldo' => floatval($saldo),
        'usuario' => $usuario,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

try {
    // Verificar que el usuario esté logueado
    if (!isset($_SESSION['id_usuario']) || !isset($_SESSION['numero_documento'])) {
        enviarRespuesta('error', 'Usuario no autenticado');
    }
    
    // Crear conexión PDO
    $dsn = "mysql:host={$host};port=3306;dbname={$db};charset={$charset}";
    $opciones = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ];
    
    $conexion = new PDO($dsn, $usuario, $password, $opciones);
    
    // Obtener documento del usuario de la sesión
    $documento_usuario = $_SESSION['numero_documento'];
    
    // Preparar la consulta para obtener el saldo actual
    $sql = "SELECT saldo, nombre_completo FROM Usuarios WHERE numero_documento = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->execute([$documento_usuario]);
    
    // Obtener resultado
    $resultado = $stmt->fetch();
    
    if (!$resultado) {
        enviarRespuesta('error', 'Usuario no encontrado');
    }
    
    $saldo_actual = floatval($resultado['saldo']);
    $nombre_usuario = $resultado['nombre_completo'] ?? $_SESSION['usuario'] ?? '';
    
    // Actualizar la sesión con el saldo actual
    $_SESSION['saldo'] = $saldo_actual;
    
    // Respuesta exitosa
    enviarRespuesta('success', 'Saldo obtenido correctamente', $saldo_actual, $nombre_usuario);
    
} catch (PDOException $e) {
    // Error de conexión o consulta
    error_log("Error de BD en Obtener_saldo.php: " . $e->getMessage());
    enviarRespuesta('error', 'Error de base de datos');
    
} catch (Exception $e) {
    // Otros errores
    error_log("Error general en Obtener_saldo.php: " . $e->getMessage());
    enviarRespuesta('error', $e->getMessage());
}
?>