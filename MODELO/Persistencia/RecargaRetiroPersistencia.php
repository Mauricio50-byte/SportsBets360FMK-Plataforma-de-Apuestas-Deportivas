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
            
            // Obtener el ID del usuario
            $sqlUsuario = "SELECT ID FROM usuarios WHERE nombre = :usuario OR correo = :correo";
            $stmtUsuario = $this->conexion->prepare($sqlUsuario);
            $stmtUsuario->bindParam(':usuario', $usuario);
            $stmtUsuario->bindParam(':correo', $correo);
            $stmtUsuario->execute();
            $usuario = $stmtUsuario->fetch(PDO::FETCH_ASSOC);
            
            if (!$usuario) {
                return "Usuario no encontrado";
            }
            
            $idUsuario = $usuario['ID'];
            $monto = $recarga->getMonto();
            
            // Iniciar transacción
            $this->conexion->beginTransaction();
            
            // Registrar la recarga en la tabla de transacciones
            $sql = "INSERT INTO transacciones (id_usuario, tipo, monto, fecha) 
                    VALUES (:id_usuario, 'recarga', :monto, NOW())";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_usuario', $idUsuario);
            $stmt->bindParam(':monto', $monto);
            $stmt->execute();
            
            // Actualizar el saldo del usuario
            $sqlUpdate = "UPDATE usuarios SET saldo = saldo + :monto WHERE ID = :id_usuario";
            $stmtUpdate = $this->conexion->prepare($sqlUpdate);
            $stmtUpdate->bindParam(':monto', $monto);
            $stmtUpdate->bindParam(':id_usuario', $idUsuario);
            $stmtUpdate->execute();
            
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
            
            // Obtener el ID y saldo del usuario
            $sqlUsuario = "SELECT ID, saldo FROM usuarios WHERE nombre = :usuario OR correo = :correo";
            $stmtUsuario = $this->conexion->prepare($sqlUsuario);
            $stmtUsuario->bindParam(':usuario', $usuario);
            $stmtUsuario->bindParam(':correo', $correo);
            $stmtUsuario->execute();
            $usuario = $stmtUsuario->fetch(PDO::FETCH_ASSOC);
            
            if (!$usuario) {
                return "Usuario no encontrado";
            }
            
            $idUsuario = $usuario['ID'];
            $saldoActual = $usuario['saldo'];
            $monto = $retiro->getMonto();
            
            // Verificar que tenga saldo suficiente
            if ($saldoActual < $monto) {
                return "Saldo insuficiente para realizar el retiro";
            }
            
            // Iniciar transacción
            $this->conexion->beginTransaction();
            
            // Registrar el retiro en la tabla de transacciones
            $sql = "INSERT INTO transacciones (id_usuario, tipo, monto, fecha) 
                    VALUES (:id_usuario, 'retiro', :monto, NOW())";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_usuario', $idUsuario);
            $stmt->bindParam(':monto', $monto);
            $stmt->execute();
            
            // Actualizar el saldo del usuario
            $sqlUpdate = "UPDATE usuarios SET saldo = saldo - :monto WHERE ID = :id_usuario";
            $stmtUpdate = $this->conexion->prepare($sqlUpdate);
            $stmtUpdate->bindParam(':monto', $monto);
            $stmtUpdate->bindParam(':id_usuario', $idUsuario);
            $stmtUpdate->execute();
            
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
            $sql = "SELECT * FROM transacciones 
                    WHERE id_usuario = :id_usuario AND tipo = 'recarga' 
                    ORDER BY fecha DESC";
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
            $sql = "SELECT * FROM transacciones 
                    WHERE id_usuario = :id_usuario AND tipo = 'retiro' 
                    ORDER BY fecha DESC";
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
            // Ajustar fecha fin para incluir todo el día
            $fechaFinAjustada = $fechaFin . ' 23:59:59';
            
            $sql = "SELECT t.*, u.nombre, u.correo, u.numero_documento 
                    FROM transacciones t
                    JOIN usuarios u ON t.id_usuario = u.ID
                    WHERE t.tipo = 'recarga' 
                    AND t.fecha BETWEEN :fecha_inicio AND :fecha_fin
                    ORDER BY t.fecha DESC";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':fecha_inicio', $fechaInicio);
            $stmt->bindParam(':fecha_fin', $fechaFinAjustada);
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
            // Ajustar fecha fin para incluir todo el día
            $fechaFinAjustada = $fechaFin . ' 23:59:59';
            
            $sql = "SELECT t.*, u.nombre, u.correo, u.numero_documento 
                    FROM transacciones t
                    JOIN usuarios u ON t.id_usuario = u.ID
                    WHERE t.tipo = 'retiro' 
                    AND t.fecha BETWEEN :fecha_inicio AND :fecha_fin
                    ORDER BY t.fecha DESC";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':fecha_inicio', $fechaInicio);
            $stmt->bindParam(':fecha_fin', $fechaFinAjustada);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            error_log("Error en listarRetirosPorFecha: " . $e->getMessage());
            return [];
        }
    }
}