<?php
// Configuración de headers para JSON
header('Content-Type: application/json');

// Conexión a la base de datos
try {
    $db = new PDO('mysql:host=localhost;port=3333;dbname=bd_pltf_apuestas', 'root', '');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Obtener datos del formulario
    $monto = isset($_POST['monto']) ? floatval($_POST['monto']) : 0;
    $tipo = isset($_POST['tipo']) ? $_POST['tipo'] : '';
    $referencia = isset($_POST['referencia']) ? $_POST['referencia'] : '';
    
    // Obtener ID de usuario de la sesión
    session_start();
    $idUsuario = isset($_SESSION['usuario_id']) ? $_SESSION['usuario_id'] : 0;
    
    if ($idUsuario > 0) {
        // Actualizar saldo de usuario
        $stmt = $db->prepare("UPDATE usuarios SET saldo = saldo + :monto WHERE ID = :id");
        $stmt->bindParam(':monto', $monto, PDO::PARAM_STR);
        $stmt->bindParam(':id', $idUsuario, PDO::PARAM_INT);
        $resultado = $stmt->execute();
        
        // Obtener nuevo saldo
        $stmtSaldo = $db->prepare("SELECT saldo FROM usuarios WHERE ID = :id");
        $stmtSaldo->bindParam(':id', $idUsuario, PDO::PARAM_INT);
        $stmtSaldo->execute();
        $saldo = $stmtSaldo->fetchColumn();
        
        // Registrar transacción
        $fecha = date('Y-m-d H:i:s');
        $tipoTrans = $monto > 0 ? 'recarga' : 'retiro';
        $montoAbs = abs($monto);
        
        $stmtTrans = $db->prepare("INSERT INTO transacciones (id_usuario, tipo, monto, fecha) VALUES (:id, :tipo, :monto, :fecha)");
        $stmtTrans->bindParam(':id', $idUsuario, PDO::PARAM_INT);
        $stmtTrans->bindParam(':tipo', $tipoTrans, PDO::PARAM_STR);
        $stmtTrans->bindParam(':monto', $montoAbs, PDO::PARAM_STR);
        $stmtTrans->bindParam(':fecha', $fecha, PDO::PARAM_STR);
        $stmtTrans->execute();
        
        echo json_encode([
            'exito' => true,
            'saldo' => $saldo,
            'mensaje' => 'Saldo actualizado correctamente'
        ]);
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
}
?>