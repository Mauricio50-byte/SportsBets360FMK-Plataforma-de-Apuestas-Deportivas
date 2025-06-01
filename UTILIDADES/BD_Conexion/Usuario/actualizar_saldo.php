<?php
// Iniciar sesión al principio
session_start();

// Configuración de headers para JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Conexión a la base de datos
try {
    $db = new PDO('mysql:host=localhost;port=3306;dbname=bd_pltf_apuestas', 'root', '');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Obtener datos del formulario
    $monto = isset($_POST['monto']) ? floatval($_POST['monto']) : 0;
    $tipo = isset($_POST['tipo']) ? $_POST['tipo'] : '';
    $referencia = isset($_POST['referencia']) ? $_POST['referencia'] : '';
    
    // Obtener ID de usuario de la sesión
    $idUsuario = isset($_SESSION['usuario_id']) ? $_SESSION['usuario_id'] : 0;
    
    if ($idUsuario > 0) {
        // Actualizar saldo de usuario
        $stmt = $db->prepare("UPDATE usuarios SET saldo = saldo + :monto WHERE ID = :id");
        $stmt->bindParam(':monto', $monto, PDO::PARAM_STR);
        $stmt->bindParam(':id', $idUsuario, PDO::PARAM_INT);
        $resultado = $stmt->execute();
        
        if ($resultado) {
            // Obtener nuevo saldo
            $stmtSaldo = $db->prepare("SELECT saldo FROM usuarios WHERE ID = :id");
            $stmtSaldo->bindParam(':id', $idUsuario, PDO::PARAM_INT);
            $stmtSaldo->execute();
            $saldo = floatval($stmtSaldo->fetchColumn());

            echo json_encode([
                'exito' => true,
                'saldo' => $saldo,
                'mensaje' => 'Saldo actualizado correctamente'
            ]);
        } else {
            echo json_encode([
                'exito' => false,
                'mensaje' => 'Error al actualizar el saldo'
            ]);
        }
    } else {
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Usuario no autenticado'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error en la base de datos: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error general: ' . $e->getMessage()
    ]);
}
?>