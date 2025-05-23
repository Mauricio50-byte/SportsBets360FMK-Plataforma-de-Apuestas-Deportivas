<?php
/**
 * obtener_saldo_usuario.php
 * Script para obtener el saldo actual del usuario desde la base de datos
 */

// Configurar headers para JSON y CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Iniciar sesión
session_start();

try {
    // Verificar que el usuario esté logueado
    if (!isset($_SESSION['id_usuario']) || !isset($_SESSION['numero_documento'])) {
        throw new Exception('Usuario no autenticado');
    }
    
    // Incluir la conexión a la base de datos
    require_once '../../../BD_Conexion.php';
    
    // Obtener documento del usuario de la sesión
    $documento_usuario = $_SESSION['numero_documento'];
    
    // Preparar la consulta para obtener el saldo actual
    $sql = "SELECT saldo FROM Usuarios WHERE numero_documento = ?";
    $stmt = $conexion->prepare($sql);
    
    if (!$stmt) {
        throw new Exception('Error al preparar la consulta: ' . $conexion->error);
    }
    
    // Bind parameters y ejecutar
    $stmt->bind_param("s", $documento_usuario);
    $stmt->execute();
    
    // Obtener resultado
    $resultado = $stmt->get_result();
    
    if ($resultado->num_rows === 0) {
        throw new Exception('Usuario no encontrado');
    }
    
    $fila = $resultado->fetch_assoc();
    $saldo_actual = floatval($fila['saldo']);
    
    // Cerrar statement
    $stmt->close();
    
    // Actualizar la sesión con el saldo actual
    $_SESSION['saldo'] = $saldo_actual;
    
    // Respuesta exitosa
    echo json_encode([
        'status' => 'success',
        'message' => 'Saldo obtenido correctamente',
        'saldo' => $saldo_actual,
        'usuario' => $_SESSION['usuario']
    ]);
    
} catch (Exception $e) {
    // Respuesta de error
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'saldo' => 0
    ]);
    
} finally {
    // Cerrar conexión si existe
    if (isset($conexion)) {
        $conexion->close();
    }
}
?>