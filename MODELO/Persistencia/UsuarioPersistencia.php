<?php
/**
 * Clase para la persistencia de los datos de usuarios
 * Gestiona las operaciones de acceso a datos relacionadas con usuarios
 */
class UsuarioPersistencia {
    private $conexion;
    
    /**
     * Constructor de la clase UsuarioPersistencia
     */
    public function __construct() {
        // Incluir el archivo de conexión a la base de datos
        require_once(__DIR__ . '/../../UTILIDADES/BD_Conexion/conexion.php');
        $this->conexion = conexion::obtenerconexion();
    }
    
    /**
     * Método para buscar un usuario por su nombre de usuario
     * @param string $nombreUsuario Nombre del usuario a buscar
     * @return array|null Datos del usuario o null si no se encuentra
     */
    public function buscarUsuarioPorNombre($nombreUsuario) {
        try {
            // Preparar la consulta
            $consulta = "SELECT * FROM usuarios WHERE nombre_usuario = :nombre_usuario LIMIT 1";
            $stmt = $this->conexion->prepare($consulta);
            $stmt->bindParam(':nombre_usuario', $nombreUsuario, PDO::PARAM_STR);
            $stmt->execute();
            
            // Verificar si se encontró el usuario
            if ($stmt->rowCount() > 0) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                return null;
            }
        } catch (Exception $e) {
            error_log("Error en buscarUsuarioPorNombre: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Método para buscar un usuario por su ID
     * @param int $idUsuario ID del usuario a buscar
     * @return array|null Datos del usuario o null si no se encuentra
     */
    public function buscarUsuarioPorId($idUsuario) {
        try {
            // Preparar la consulta
            $consulta = "SELECT * FROM usuarios WHERE ID = :id_usuario LIMIT 1";
            $stmt = $this->conexion->prepare($consulta);
            $stmt->bindParam(':id_usuario', $idUsuario, PDO::PARAM_INT);
            $stmt->execute();
            
            // Verificar si se encontró el usuario
            if ($stmt->rowCount() > 0) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                return null;
            }
        } catch (Exception $e) {
            error_log("Error en buscarUsuarioPorId: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Método para actualizar el saldo de un usuario
     * @param int $idUsuario ID del usuario
     * @param float $nuevoSaldo Nuevo saldo a establecer
     * @return boolean True si la actualización fue exitosa, False en caso contrario
     */
    public function actualizarSaldoUsuario($idUsuario, $nuevoSaldo) {
        try {
            // Preparar la consulta
            $consulta = "UPDATE usuarios SET saldo = :nuevo_saldo WHERE ID = :id_usuario";
            $stmt = $this->conexion->prepare($consulta);
            $stmt->bindParam(':nuevo_saldo', $nuevoSaldo, PDO::PARAM_STR);
            $stmt->bindParam(':id_usuario', $idUsuario, PDO::PARAM_INT);
            
            // Ejecutar la actualización
            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Error en actualizarSaldoUsuario: " . $e->getMessage());
            return false;
        }
    }
}
?>