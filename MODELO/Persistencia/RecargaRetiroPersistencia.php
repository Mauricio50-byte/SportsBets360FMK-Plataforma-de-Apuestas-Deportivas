<?php
/**
 * Clase de persistencia para manejar operaciones de recarga y retiro en la base de datos
 * Implementa métodos para registrar y consultar transacciones financieras
 */
class RecargaRetiroPersistencia {
    private $conexion;
    
    /**
     * Constructor de la clase RecargaRetiroPersistencia
     */
    public function __construct() {
        // Incluir el archivo de conexión a la base de datos
        require_once(__DIR__ . '/../../UTILIDADES/BD_Conexion/conexion.php');
        $this->conexion = Conexion::obtenerInstancia()->obtenerConexion();
    }
    
    /**
     * Registra una nueva recarga en la base de datos
     * 
     * @param RecargaRetiro $recarga Objeto con los datos de la recarga
     * @return boolean|string true si fue exitoso, mensaje de error en caso contrario
     */
    public function registrarRecarga($recarga) {
        try {
            // Obtener los valores como variables antes de pasarlos por referencia
            $usuario = $recarga->getUsuario();
            $correo = $recarga->getCorreo();
            
            // Obtener el ID, documento y saldo del usuario
            $sqlUsuario = "SELECT ID, numero_documento, saldo FROM usuarios WHERE nombre = :usuario OR correo = :correo";
            $stmtUsuario = $this->conexion->prepare($sqlUsuario);
            $stmtUsuario->bindParam(':usuario', $usuario);
            $stmtUsuario->bindParam(':correo', $correo);
            $stmtUsuario->execute();
            $datosUsuario = $stmtUsuario->fetch(PDO::FETCH_ASSOC);
            
            if (!$datosUsuario) {
                return "Usuario no encontrado";
            }
            
            $idUsuario = $datosUsuario['ID'];
            $documentoUsuario = $datosUsuario['numero_documento'];
            $saldoActual = $datosUsuario['saldo'];
            $monto = $recarga->getMonto();
            $nuevoSaldo = $saldoActual + $monto;
            $fechaActual = date('Y-m-d');
            
            // Iniciar transacción
            $this->conexion->beginTransaction();
            
            // Registrar la recarga en la tabla de recargas
            $sql = "INSERT INTO recargas (ID_usuario, Documento_usuario, Correo_usuario, Fecha_recarga, Monto_recarga, Saldo) 
                    VALUES (:id_usuario, :documento_usuario, :correo_usuario, :fecha_recarga, :monto_recarga, :saldo)";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_usuario', $idUsuario);
            $stmt->bindParam(':documento_usuario', $documentoUsuario);
            $stmt->bindParam(':correo_usuario', $correo);
            $stmt->bindParam(':fecha_recarga', $fechaActual);
            $stmt->bindParam(':monto_recarga', $monto);
            $stmt->bindParam(':saldo', $nuevoSaldo);
            $stmt->execute();
            
            // Actualizar el saldo del usuario
            $sqlUpdate = "UPDATE usuarios SET saldo = :nuevo_saldo WHERE ID = :id_usuario";
            $stmtUpdate = $this->conexion->prepare($sqlUpdate);
            $stmtUpdate->bindParam(':nuevo_saldo', $nuevoSaldo);
            $stmtUpdate->bindParam(':id_usuario', $idUsuario);
            $stmtUpdate->execute();
            
            // Registrar también en la tabla transacciones para mantener consistencia
            $sqlTransaccion = "INSERT INTO transacciones (id_usuario, tipo, monto, fecha) 
                                VALUES (:id_usuario, 'recarga', :monto, NOW())";
            $stmtTransaccion = $this->conexion->prepare($sqlTransaccion);
            $stmtTransaccion->bindParam(':id_usuario', $idUsuario);
            $stmtTransaccion->bindParam(':monto', $monto);
            $stmtTransaccion->execute();
            
            // Confirmar transacción
            $this->conexion->commit();
            
            return true;
            
        } catch (PDOException $e) {
            // Revertir cambios en caso de error
            if ($this->conexion->inTransaction()) {
                $this->conexion->rollBack();
            }
            error_log("Error en registrarRecarga: " . $e->getMessage());
            return "Error al procesar la recarga: " . $e->getMessage();
        }
    }
    
    /**
     * Registra un nuevo retiro en la base de datos
     * 
     * @param RecargaRetiro $retiro Objeto con los datos del retiro
     * @return boolean|string true si fue exitoso, mensaje de error en caso contrario
     */
    public function registrarRetiro($retiro) {
        try {
            // Obtener los valores como variables antes de pasarlos por referencia
            $usuario = $retiro->getUsuario();
            $correo = $retiro->getCorreo();
            
            // Obtener el ID, documento y saldo del usuario
            $sqlUsuario = "SELECT ID, numero_documento, saldo FROM usuarios WHERE nombre = :usuario OR correo = :correo";
            $stmtUsuario = $this->conexion->prepare($sqlUsuario);
            $stmtUsuario->bindParam(':usuario', $usuario);
            $stmtUsuario->bindParam(':correo', $correo);
            $stmtUsuario->execute();
            $datosUsuario = $stmtUsuario->fetch(PDO::FETCH_ASSOC);
            
            if (!$datosUsuario) {
                return "Usuario no encontrado";
            }
            
            $idUsuario = $datosUsuario['ID'];
            $documentoUsuario = $datosUsuario['numero_documento'];
            $saldoActual = $datosUsuario['saldo'];
            $monto = $retiro->getMonto();
            
            // Verificar que tenga saldo suficiente
            if ($saldoActual < $monto) {
                return "Saldo insuficiente para realizar el retiro";
            }
            
            $nuevoSaldo = $saldoActual - $monto;
            $fechaActual = date('Y-m-d');
            
            // Iniciar transacción
            $this->conexion->beginTransaction();
            
            // Registrar el retiro en la tabla de retiros
            $sql = "INSERT INTO retiros (ID_usuario, Documento_usuario, Correo_usuario, Fecha_retiro, Monto_retiro, Saldo) 
                    VALUES (:id_usuario, :documento_usuario, :correo_usuario, :fecha_retiro, :monto_retiro, :saldo)";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_usuario', $idUsuario);
            $stmt->bindParam(':documento_usuario', $documentoUsuario);
            $stmt->bindParam(':correo_usuario', $correo);
            $stmt->bindParam(':fecha_retiro', $fechaActual);
            $stmt->bindParam(':monto_retiro', $monto);
            $stmt->bindParam(':saldo', $nuevoSaldo);
            $stmt->execute();
            
            // Actualizar el saldo del usuario
            $sqlUpdate = "UPDATE usuarios SET saldo = :nuevo_saldo WHERE ID = :id_usuario";
            $stmtUpdate = $this->conexion->prepare($sqlUpdate);
            $stmtUpdate->bindParam(':nuevo_saldo', $nuevoSaldo);
            $stmtUpdate->bindParam(':id_usuario', $idUsuario);
            $stmtUpdate->execute();
            
            // Registrar también en la tabla transacciones para mantener consistencia
            $sqlTransaccion = "INSERT INTO transacciones (id_usuario, tipo, monto, fecha) 
                                VALUES (:id_usuario, 'retiro', :monto, NOW())";
            $stmtTransaccion = $this->conexion->prepare($sqlTransaccion);
            $stmtTransaccion->bindParam(':id_usuario', $idUsuario);
            $stmtTransaccion->bindParam(':monto', $monto);
            $stmtTransaccion->execute();
            
            // Confirmar transacción
            $this->conexion->commit();
            
            return true;
            
        } catch (PDOException $e) {
            // Revertir cambios en caso de error
            if ($this->conexion->inTransaction()) {
                $this->conexion->rollBack();
            }
            error_log("Error en registrarRetiro: " . $e->getMessage());
            return "Error al procesar el retiro: " . $e->getMessage();
        }
    }
    
    /**
     * Lista las recargas realizadas por un usuario
     * 
     * @param int $idUsuario ID del usuario
     * @return array Lista de recargas
     */
    public function listarRecargasPorUsuario($idUsuario) {
        try {
            $sql = "SELECT * FROM recargas 
                    WHERE ID_usuario = :id_usuario 
                    ORDER BY Fecha_recarga DESC";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_usuario', $idUsuario);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            error_log("Error en listarRecargasPorUsuario: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Lista los retiros realizados por un usuario
     * 
     * @param int $idUsuario ID del usuario
     * @return array Lista de retiros
     */
    public function listarRetirosPorUsuario($idUsuario) {
        try {
            $sql = "SELECT * FROM retiros 
                    WHERE ID_usuario = :id_usuario 
                    ORDER BY Fecha_retiro DESC";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_usuario', $idUsuario);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            error_log("Error en listarRetirosPorUsuario: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Lista las recargas realizadas en un rango de fechas
     * 
     * @param string $fechaInicio Fecha de inicio formato Y-m-d
     * @param string $fechaFin Fecha de fin formato Y-m-d
     * @return array Lista de recargas en el rango
     */
    public function listarRecargasPorFecha($fechaInicio, $fechaFin) {
        try {
            $sql = "SELECT r.*, u.nombre, u.apellido 
                    FROM recargas r
                    JOIN usuarios u ON r.ID_usuario = u.ID
                    WHERE r.Fecha_recarga BETWEEN :fecha_inicio AND :fecha_fin
                    ORDER BY r.Fecha_recarga DESC";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':fecha_inicio', $fechaInicio);
            $stmt->bindParam(':fecha_fin', $fechaFin);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            error_log("Error en listarRecargasPorFecha: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Lista los retiros realizados en un rango de fechas
     * 
     * @param string $fechaInicio Fecha de inicio formato Y-m-d
     * @param string $fechaFin Fecha de fin formato Y-m-d
     * @return array Lista de retiros en el rango
     */
    public function listarRetirosPorFecha($fechaInicio, $fechaFin) {
        try {
            $sql = "SELECT r.*, u.nombre, u.apellido 
                    FROM retiros r
                    JOIN usuarios u ON r.ID_usuario = u.ID
                    WHERE r.Fecha_retiro BETWEEN :fecha_inicio AND :fecha_fin
                    ORDER BY r.Fecha_retiro DESC";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':fecha_inicio', $fechaInicio);
            $stmt->bindParam(':fecha_fin', $fechaFin);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            error_log("Error en listarRetirosPorFecha: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Obtiene el historial completo de transacciones de un usuario
     * 
     * @param int $idUsuario ID del usuario
     * @return array Historial de transacciones del usuario
     */
    public function obtenerHistorialTransacciones($idUsuario) {
        try {
            $sql = "SELECT * FROM historial_transacciones 
                    WHERE ID_usuario = :id_usuario 
                    ORDER BY Fecha DESC";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_usuario', $idUsuario);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            error_log("Error en obtenerHistorialTransacciones: " . $e->getMessage());
            return [];
        }
    }
}