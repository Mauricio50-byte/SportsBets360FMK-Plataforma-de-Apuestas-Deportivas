<?php
/**
 * Controlador para gestionar transacciones monetarias
 * @author SportsBets360FMK
 */
class TransaccionController {
    // Añadimos la propiedad conexion
    private $conexion;
    
    /**
     * Constructor de la clase
     */
    public function __construct() {
        // Inicia sesión si no está iniciada
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        
        // Incluir clase de conexión
        require_once '../UTILIDADES/BD_Conexion/conexion.php';
        
        // Inicializar la conexión usando el método correcto obtenerInstancia()
        $this->conexion = Conexion::obtenerInstancia();
    }
    
    /**
     * Procesa las solicitudes al controlador
     */
    public function procesarSolicitud() {
        // Verificar que el usuario esté logueado
        if (!isset($_SESSION['usuario_id'])) {
            $this->responderJSON([
                'exito' => false,
                'mensaje' => 'Usuario no autenticado'
            ]);
            return;
        }
        
        // Determinar la acción solicitada
        $accion = isset($_POST['accion']) ? $_POST['accion'] : '';
        
        switch ($accion) {
            case 'actualizarSaldo':
                $this->actualizarSaldo();
                break;
            case 'obtenerHistorial':
                $this->obtenerHistorialTransacciones();
                break;
            default:
                $this->responderJSON([
                    'exito' => false,
                    'mensaje' => 'Acción no reconocida'
                ]);
                break;
        }
    }
    
    /**
     * Actualiza el saldo del usuario
     */
    private function actualizarSaldo() {
        // Obtener parámetros
        $monto = isset($_POST['monto']) ? floatval($_POST['monto']) : 0;
        $tipo = isset($_POST['tipo']) ? $_POST['tipo'] : '';
        $referencia = isset($_POST['referencia']) ? $_POST['referencia'] : '';
        
        // Validar datos
        if ($monto == 0) {
            $this->responderJSON([
                'exito' => false,
                'mensaje' => 'Monto no válido'
            ]);
            return;
        }
        
        if (empty($tipo)) {
            $this->responderJSON([
                'exito' => false,
                'mensaje' => 'Tipo de transacción no válido'
            ]);
            return;
        }
        
        // Obtener el usuario actual y su saldo
        $usuarioId = $_SESSION['usuario_id'];
        $saldoActual = isset($_SESSION['usuario_saldo']) ? floatval($_SESSION['usuario_saldo']) : 0;
        
        // Si es una apuesta, verificar que tenga saldo suficiente
        if ($tipo == 'apuesta' && $monto < 0 && abs($monto) > $saldoActual) {
            $this->responderJSON([
                'exito' => false,
                'mensaje' => 'Saldo insuficiente'
            ]);
            return;
        }
        
        // Calcular nuevo saldo
        $nuevoSaldo = $saldoActual + $monto;
        
        // Registrar transacción en la base de datos
        $registroExitoso = $this->registrarTransaccion($usuarioId, $monto, $tipo, $referencia, $nuevoSaldo);
        
        if ($registroExitoso) {
            // Actualizar saldo en sesión
            $_SESSION['usuario_saldo'] = $nuevoSaldo;
            
            $this->responderJSON([
                'exito' => true,
                'mensaje' => 'Saldo actualizado correctamente',
                'saldo' => $nuevoSaldo
            ]);
        } else {
            $this->responderJSON([
                'exito' => false,
                'mensaje' => 'Error al registrar la transacción'
            ]);
        }
    }
    
    /**
     * Registra una transacción en la base de datos
     * @param int $usuarioId ID del usuario
     * @param float $monto Monto de la transacción
     * @param string $tipo Tipo de transacción
     * @param string $referencia Referencia de la transacción
     * @param float $saldoResultante Saldo resultante después de la transacción
     * @return bool True si se registró correctamente, False en caso contrario
     */
        private function registrarTransaccion($usuarioId, $monto, $tipo, $referencia, $saldoResultante) {
        try {
            // Usar la conexión a través de los métodos proporcionados por la clase Conexion
            $sql = "INSERT INTO transacciones (usuario_id, monto, tipo, referencia, saldo_resultante, fecha) 
                    VALUES (:usuarioId, :monto, :tipo, :referencia, :saldoResultante, NOW())";
            
            $parametros = [
                ':usuarioId' => $usuarioId,
                ':monto' => $monto,
                ':tipo' => $tipo,
                ':referencia' => $referencia,
                ':saldoResultante' => $saldoResultante
            ];
            
            // Usar ejecutarActualizacion en lugar de intentar usar PDO directamente
            $filasAfectadas = $this->conexion->ejecutarActualizacion($sql, $parametros);
            
            return $filasAfectadas > 0;
        } catch (Exception $e) {
            // Registrar error en logs
            error_log("Error al registrar transacción: " . $e->getMessage());
            return false;
        }
    }
        
    /**
     * Obtiene el historial de transacciones del usuario
     */
        private function obtenerHistorialTransacciones() {
        try {
            // Obtener el usuario actual
            $usuarioId = $_SESSION['usuario_id'];
            
            // Usar el método ejecutarConsulta de la clase Conexion
            $sql = "SELECT id, monto, tipo, referencia, saldo_resultante, fecha 
                    FROM transacciones 
                    WHERE usuario_id = :usuarioId 
                    ORDER BY fecha DESC 
                    LIMIT 50";
            
            $parametros = [':usuarioId' => $usuarioId];
            $transacciones = $this->conexion->ejecutarConsulta($sql, $parametros);
            
            $this->responderJSON([
                'exito' => true,
                'transacciones' => $transacciones
            ]);
        } catch (Exception $e) {
            error_log("Error al obtener historial: " . $e->getMessage());
            
            $this->responderJSON([
                'exito' => false,
                'mensaje' => 'Error al obtener historial de transacciones'
            ]);
        }
    }
    
    /**
     * Envía una respuesta JSON
     * @param array $datos Datos a enviar
     */
    private function responderJSON($datos) {
        header('Content-Type: application/json');
        echo json_encode($datos);
        exit;
    }
}

// Iniciar procesamiento si se accede directamente
if (basename($_SERVER['PHP_SELF']) == basename(__FILE__)) {
    $controller = new TransaccionController();
    $controller->procesarSolicitud();
}