<?php
/**
 * Clase RecargaRetiroPersistencia - Gestiona las operaciones de base de datos para recargas y retiros
 * Adaptada para trabajar con la estructura de la base de datos existente
 */
class RecargaRetiroPersistencia {
    private $conexion;
    
    /**
     * Constructor de la clase RecargaRetiroPersistencia
     */
    public function __construct() {
        // Incluir el archivo de conexión a la base de datos
        require_once(__DIR__ . '/../../UTILIDADES/BD_Conexion/conexion.php');
        // Obtenemos la instancia de Conexion y luego la conexión PDO
        $this->conexion = Conexion::obtenerInstancia()->obtenerConexion();
    }
    
    /**
     * Registra una recarga en la base de datos
     * @param RecargaRetiro $recarga Objeto de recarga
     * @return mixed true si la operación fue exitosa, mensaje de error en caso contrario
     */
    public function registrarRecarga($recarga) {
        try {
            // Iniciar transacción
            $this->conexion->beginTransaction();
            
            // Obtener el saldo actual del usuario
            $stmtSaldo = $this->conexion->prepare("SELECT saldo FROM usuarios WHERE ID = ? AND numero_documento = ? AND correo = ?");
            $stmtSaldo->execute([
                $recarga->getIdUsuario(),
                $recarga->getDocumentoUsuario(),
                $recarga->getCorreoUsuario()
            ]);
            
            $usuario = $stmtSaldo->fetch(PDO::FETCH_ASSOC);
            
            if (!$usuario) {
                $this->conexion->rollBack();
                return "No se encontró el usuario con los datos proporcionados";
            }
            
            // Calcular nuevo saldo
            $saldoActual = floatval($usuario['saldo']);
            $nuevoSaldo = $saldoActual + $recarga->getMonto();
            
            // Actualizar saldo en la tabla de usuarios
            $stmtUsuario = $this->conexion->prepare("UPDATE usuarios SET saldo = ? WHERE ID = ?");
            $stmtUsuario->execute([$nuevoSaldo, $recarga->getIdUsuario()]);
            
            // Establecer el nuevo saldo en el objeto recarga
            $recarga->setSaldo($nuevoSaldo);
            
            // Registrar la recarga en la tabla de recargas
            $stmtRecarga = $this->conexion->prepare("
                INSERT INTO recargas (ID_usuario, Documento_usuario, Correo_usuario, Fecha_recarga, Monto_recarga, Saldo) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            
            $stmtRecarga->execute([
                $recarga->getIdUsuario(),
                $recarga->getDocumentoUsuario(),
                $recarga->getCorreoUsuario(),
                $recarga->getFecha(),
                $recarga->getMonto(),
                $recarga->getSaldo()
            ]);
            
            // Confirmar la transacción
            $this->conexion->commit();
            return true;
            
        } catch (PDOException $e) {
            // Revertir la transacción en caso de error
            $this->conexion->rollBack();
            error_log("Error en registrarRecarga: " . $e->getMessage());
            return $e->getMessage();
        }
    }
    
    /**
     * Registra un retiro en la base de datos
     * @param RecargaRetiro $retiro Objeto de retiro
     * @return mixed true si la operación fue exitosa, mensaje de error en caso contrario
     */
    public function registrarRetiro($retiro) {
        try {
            // Iniciar transacción
            $this->conexion->beginTransaction();
            
            // Obtener el saldo actual del usuario
            $stmtSaldo = $this->conexion->prepare("SELECT saldo FROM usuarios WHERE ID = ? AND numero_documento = ? AND correo = ?");
            $stmtSaldo->execute([
                $retiro->getIdUsuario(),
                $retiro->getDocumentoUsuario(),
                $retiro->getCorreoUsuario()
            ]);
            
            $usuario = $stmtSaldo->fetch(PDO::FETCH_ASSOC);
            
            if (!$usuario) {
                $this->conexion->rollBack();
                return "No se encontró el usuario con los datos proporcionados";
            }
            
            // Validar que el saldo sea suficiente
            $saldoActual = floatval($usuario['saldo']);
            if ($saldoActual < $retiro->getMonto()) {
                $this->conexion->rollBack();
                return "Saldo insuficiente para realizar el retiro";
            }
            
            // Calcular nuevo saldo
            $nuevoSaldo = $saldoActual - $retiro->getMonto();
            
            // Actualizar saldo en la tabla de usuarios
            $stmtUsuario = $this->conexion->prepare("UPDATE usuarios SET saldo = ? WHERE ID = ?");
            $stmtUsuario->execute([$nuevoSaldo, $retiro->getIdUsuario()]);
            
            // Establecer el nuevo saldo en el objeto retiro
            $retiro->setSaldo($nuevoSaldo);
            
            // Registrar el retiro en la tabla de retiros
            $stmtRetiro = $this->conexion->prepare("
                INSERT INTO retiros (ID_usuario, Documento_usuario, Correo_usuario, Fecha_retiro, Monto_retiro, Saldo) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            
            $stmtRetiro->execute([
                $retiro->getIdUsuario(),
                $retiro->getDocumentoUsuario(),
                $retiro->getCorreoUsuario(),
                $retiro->getFecha(),
                $retiro->getMonto(),
                $retiro->getSaldo()
            ]);
            
            // Confirmar la transacción
            $this->conexion->commit();
            return true;
            
        } catch (PDOException $e) {
            // Revertir la transacción en caso de error
            $this->conexion->rollBack();
            error_log("Error en registrarRetiro: " . $e->getMessage());
            return $e->getMessage();
        }
    }
    
    /**
     * Lista las recargas de un usuario específico
     * @param int $idUsuario ID del usuario
     * @return array Lista de recargas
     */
    public function listarRecargasPorUsuario($idUsuario) {
        try {
            $stmt = $this->conexion->prepare("
                SELECT * FROM recargas 
                WHERE ID_usuario = ? 
                ORDER BY Fecha_recarga DESC
            ");
            $stmt->execute([$idUsuario]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error en listarRecargasPorUsuario: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Lista los retiros de un usuario específico
     * @param int $idUsuario ID del usuario
     * @return array Lista de retiros
     */
    public function listarRetirosPorUsuario($idUsuario) {
        try {
            $stmt = $this->conexion->prepare("
                SELECT * FROM retiros 
                WHERE ID_usuario = ? 
                ORDER BY Fecha_retiro DESC
            ");
            $stmt->execute([$idUsuario]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error en listarRetirosPorUsuario: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Lista las recargas en un rango de fechas
     * @param string $fechaInicio Fecha de inicio formato Y-m-d
     * @param string $fechaFin Fecha de fin formato Y-m-d
     * @return array Lista de recargas
     */
    public function listarRecargasPorFecha($fechaInicio, $fechaFin) {
        try {
            $stmt = $this->conexion->prepare("
                SELECT r.*, u.nombre, u.apellido
                FROM recargas r
                JOIN usuarios u ON r.ID_usuario = u.ID
                WHERE r.Fecha_recarga BETWEEN ? AND ?
                ORDER BY r.Fecha_recarga DESC
            ");
            $stmt->execute([$fechaInicio, $fechaFin]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error en listarRecargasPorFecha: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Lista los retiros en un rango de fechas
     * @param string $fechaInicio Fecha de inicio formato Y-m-d
     * @param string $fechaFin Fecha de fin formato Y-m-d
     * @return array Lista de retiros
     */
    public function listarRetirosPorFecha($fechaInicio, $fechaFin) {
        try {
            $stmt = $this->conexion->prepare("
                SELECT r.*, u.nombre, u.apellido
                FROM retiros r
                JOIN usuarios u ON r.ID_usuario = u.ID
                WHERE r.Fecha_retiro BETWEEN ? AND ?
                ORDER BY r.Fecha_retiro DESC
            ");
            $stmt->execute([$fechaInicio, $fechaFin]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error en listarRetirosPorFecha: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Busca un usuario por su nombre o nombre de usuario
     * @param string $nombreUsuario El nombre o nombre de usuario a buscar
     * @return array|false Datos del usuario o false si no se encuentra
     */
    public function buscarUsuarioPorNombre($nombreUsuario) {
        try {
            $stmt = $this->conexion->prepare("
                SELECT ID, nombre, apellido, numero_documento, correo 
                FROM usuarios 
                WHERE nombre = ? OR nombre_usuario = ?
                LIMIT 1
            ");
            $stmt->execute([$nombreUsuario, $nombreUsuario]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error en buscarUsuarioPorNombre: " . $e->getMessage());
            return false;
        }
    }
}
?>