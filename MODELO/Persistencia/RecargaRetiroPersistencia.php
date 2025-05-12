<?php
/**
 * Clase de persistencia para las operaciones de recarga y retiro
 * Gestiona todas las operaciones de base de datos relacionadas con transacciones de saldo
 */
class RecargaRetiroPersistencia {
    private $conexion;
    
    /**
     * Constructor de la clase de persistencia
     */
    public function __construct() {
        // Incluir la clase de conexión
        require_once(__DIR__ . '/../UTILIDADES/BD_Conexion/conexion.php');
        
        // Obtener la instancia de conexión
        $this->conexion = Conexion::obtenerInstancia()->obtenerConexion();
    }
    
    /**
     * Método para registrar una nueva recarga en la base de datos
     * @param RecargaRetiro $recarga Objeto RecargaRetiro con los datos de la recarga
     * @return bool|string True si el registro es exitoso, mensaje de error en caso contrario
     */
    public function registrarRecarga($recarga) {
        try {
            // Iniciar transacción
            $this->conexion->beginTransaction();
            
            // Primero obtener el usuario por el documento para verificar existencia
            $sql = "SELECT ID, saldo FROM usuarios WHERE numero_documento = :documento AND correo = :correo";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindValue(':documento', $recarga->getDocumento(), PDO::PARAM_STR);
            $stmt->bindValue(':correo', $recarga->getCorreo(), PDO::PARAM_STR);
            $stmt->execute();
            
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$usuario) {
                $this->conexion->rollBack();
                return "No se encontró un usuario con el documento y correo proporcionados";
            }
            
            // Calcular nuevo saldo
            $nuevoSaldo = $usuario['saldo'] + $recarga->getMonto();
            
            // Actualizar saldo del usuario
            $sqlUpdate = "UPDATE usuarios SET saldo = :saldo WHERE ID = :id";
            $stmtUpdate = $this->conexion->prepare($sqlUpdate);
            $stmtUpdate->bindValue(':saldo', $nuevoSaldo, PDO::PARAM_STR);
            $stmtUpdate->bindValue(':id', $usuario['ID'], PDO::PARAM_INT);
            $resultadoUpdate = $stmtUpdate->execute();
            
            if (!$resultadoUpdate) {
                $this->conexion->rollBack();
                return "Error al actualizar el saldo del usuario";
            }
            
            // Registrar la transacción de recarga
            $sqlInsert = "INSERT INTO recargas (id_usuario, usuario, documento, correo, monto, fecha) 
                        VALUES (:id_usuario, :usuario, :documento, :correo, :monto, :fecha)";
            
            $stmtInsert = $this->conexion->prepare($sqlInsert);
            $stmtInsert->bindValue(':id_usuario', $usuario['ID'], PDO::PARAM_INT);
            $stmtInsert->bindValue(':usuario', $recarga->getUsuario(), PDO::PARAM_STR);
            $stmtInsert->bindValue(':documento', $recarga->getDocumento(), PDO::PARAM_STR);
            $stmtInsert->bindValue(':correo', $recarga->getCorreo(), PDO::PARAM_STR);
            $stmtInsert->bindValue(':monto', $recarga->getMonto(), PDO::PARAM_STR);
            $stmtInsert->bindValue(':fecha', $recarga->getFecha(), PDO::PARAM_STR);
            
            $resultadoInsert = $stmtInsert->execute();
            
            if (!$resultadoInsert) {
                $this->conexion->rollBack();
                return "Error al registrar la recarga";
            }
            
            // Confirmar transacción
            $this->conexion->commit();
            
            return true;
        } catch (PDOException $e) {
            // Revertir transacción en caso de error
            if ($this->conexion->inTransaction()) {
                $this->conexion->rollBack();
            }
            error_log("Error al registrar recarga: " . $e->getMessage());
            return "Error al procesar la recarga: " . $e->getMessage();
        }
    }
    
    /**
     * Método para registrar un nuevo retiro en la base de datos
     * @param RecargaRetiro $retiro Objeto RecargaRetiro con los datos del retiro
     * @return bool|string True si el registro es exitoso, mensaje de error en caso contrario
     */
    public function registrarRetiro($retiro) {
        try {
            // Iniciar transacción
            $this->conexion->beginTransaction();
            
            // Primero obtener el usuario por el documento para verificar existencia
            $sql = "SELECT ID, saldo FROM usuarios WHERE numero_documento = :documento AND correo = :correo";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindValue(':documento', $retiro->getDocumento(), PDO::PARAM_STR);
            $stmt->bindValue(':correo', $retiro->getCorreo(), PDO::PARAM_STR);
            $stmt->execute();
            
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$usuario) {
                $this->conexion->rollBack();
                return "No se encontró un usuario con el documento y correo proporcionados";
            }
            
            // Verificar que tenga saldo suficiente
            if ($usuario['saldo'] < $retiro->getMonto()) {
                $this->conexion->rollBack();
                return "Saldo insuficiente para realizar el retiro";
            }
            
            // Calcular nuevo saldo
            $nuevoSaldo = $usuario['saldo'] - $retiro->getMonto();
            
            // Actualizar saldo del usuario
            $sqlUpdate = "UPDATE usuarios SET saldo = :saldo WHERE ID = :id";
            $stmtUpdate = $this->conexion->prepare($sqlUpdate);
            $stmtUpdate->bindValue(':saldo', $nuevoSaldo, PDO::PARAM_STR);
            $stmtUpdate->bindValue(':id', $usuario['ID'], PDO::PARAM_INT);
            $resultadoUpdate = $stmtUpdate->execute();
            
            if (!$resultadoUpdate) {
                $this->conexion->rollBack();
                return "Error al actualizar el saldo del usuario";
            }
            
            // Registrar la transacción de retiro
            $sqlInsert = "INSERT INTO retiros (id_usuario, usuario, documento, correo, monto, fecha) 
                        VALUES (:id_usuario, :usuario, :documento, :correo, :monto, :fecha)";
            
            $stmtInsert = $this->conexion->prepare($sqlInsert);
            $stmtInsert->bindValue(':id_usuario', $usuario['ID'], PDO::PARAM_INT);
            $stmtInsert->bindValue(':usuario', $retiro->getUsuario(), PDO::PARAM_STR);
            $stmtInsert->bindValue(':documento', $retiro->getDocumento(), PDO::PARAM_STR);
            $stmtInsert->bindValue(':correo', $retiro->getCorreo(), PDO::PARAM_STR);
            $stmtInsert->bindValue(':monto', $retiro->getMonto(), PDO::PARAM_STR);
            $stmtInsert->bindValue(':fecha', $retiro->getFecha(), PDO::PARAM_STR);
            
            $resultadoInsert = $stmtInsert->execute();
            
            if (!$resultadoInsert) {
                $this->conexion->rollBack();
                return "Error al registrar el retiro";
            }
            
            // Confirmar transacción
            $this->conexion->commit();
            
            return true;
        } catch (PDOException $e) {
            // Revertir transacción en caso de error
            if ($this->conexion->inTransaction()) {
                $this->conexion->rollBack();
            }
            error_log("Error al registrar retiro: " . $e->getMessage());
            return "Error al procesar el retiro: " . $e->getMessage();
        }
    }
    
    /**
     * Método para listar todas las recargas de un usuario
     * @param int $idUsuario ID del usuario
     * @return array Lista de recargas o array vacío si hay error
     */
    public function listarRecargasPorUsuario($idUsuario) {
        try {
            $sql = "SELECT * FROM recargas WHERE id_usuario = :id_usuario ORDER BY fecha DESC";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_usuario', $idUsuario, PDO::PARAM_INT);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error al listar recargas por usuario: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Método para listar todos los retiros de un usuario
     * @param int $idUsuario ID del usuario
     * @return array Lista de retiros o array vacío si hay error
     */
    public function listarRetirosPorUsuario($idUsuario) {
        try {
            $sql = "SELECT * FROM retiros WHERE id_usuario = :id_usuario ORDER BY fecha DESC";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_usuario', $idUsuario, PDO::PARAM_INT);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error al listar retiros por usuario: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Método para obtener todas las recargas en un rango de fechas
     * @param string $fechaInicio Fecha de inicio formato Y-m-d
     * @param string $fechaFin Fecha de fin formato Y-m-d
     * @return array Lista de recargas o array vacío si hay error
     */
    public function listarRecargasPorFecha($fechaInicio, $fechaFin) {
        try {
            $sql = "SELECT r.*, u.nombre, u.apellido 
                    FROM recargas r 
                    INNER JOIN usuarios u ON r.id_usuario = u.ID 
                    WHERE DATE(r.fecha) BETWEEN :fecha_inicio AND :fecha_fin 
                    ORDER BY r.fecha DESC";
            
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':fecha_inicio', $fechaInicio, PDO::PARAM_STR);
            $stmt->bindParam(':fecha_fin', $fechaFin, PDO::PARAM_STR);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error al listar recargas por fecha: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Método para obtener todos los retiros en un rango de fechas
     * @param string $fechaInicio Fecha de inicio formato Y-m-d
     * @param string $fechaFin Fecha de fin formato Y-m-d
     * @return array Lista de retiros o array vacío si hay error
     */
    public function listarRetirosPorFecha($fechaInicio, $fechaFin) {
        try {
            $sql = "SELECT r.*, u.nombre, u.apellido 
                    FROM retiros r 
                    INNER JOIN usuarios u ON r.id_usuario = u.ID 
                    WHERE DATE(r.fecha) BETWEEN :fecha_inicio AND :fecha_fin 
                    ORDER BY r.fecha DESC";
            
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':fecha_inicio', $fechaInicio, PDO::PARAM_STR);
            $stmt->bindParam(':fecha_fin', $fechaFin, PDO::PARAM_STR);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error al listar retiros por fecha: " . $e->getMessage());
            return [];
        }
    }
}
?>