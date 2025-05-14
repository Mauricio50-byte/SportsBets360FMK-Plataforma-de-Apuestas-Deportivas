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
        $this->conexion = Conexion::obtenerInstancia()->obtenerConexion();
    }
    
    /**
     * Método para crear un nuevo usuario en la base de datos
     * @param Usuario $usuario Objeto Usuario con los datos a guardar
     * @return bool|string True si el registro es exitoso, mensaje de error en caso contrario
     */
    public function crearUsuario($usuario) {
        try {
            // Verificar si el correo ya existe
            if ($this->verificarCorreoExistente($usuario->getCorreo())) {
                return "El correo electrónico ya está registrado";
            }
            
            // Verificar si el documento ya existe
            if ($this->verificarDocumentoExistente($usuario->getNumeroDocumento())) {
                return "El número de documento ya está registrado";
            }
            
            // Preparar la consulta de inserción
            $consulta = "INSERT INTO usuarios (nombre, apellido, sexo, tipo_documento, 
                      numero_documento, telefono, correo, contrasena, saldo, estado) 
                      VALUES (:nombre, :apellido, :sexo, :tipo_documento, :numero_documento, 
                      :telefono, :correo, :contrasena, :saldo, :estado)";
            
            // Preparar la sentencia
            $stmt = $this->conexion->prepare($consulta);
            
            // Encriptar la contraseña
            $contrasenaEncriptada = password_hash($usuario->getContrasena(), PASSWORD_DEFAULT);
            
            // Asignar los parámetros
            $stmt->bindValue(':nombre', $usuario->getNombre(), PDO::PARAM_STR);
            $stmt->bindValue(':apellido', $usuario->getApellido(), PDO::PARAM_STR);
            $stmt->bindValue(':sexo', $usuario->getSexo(), PDO::PARAM_STR);
            $stmt->bindValue(':tipo_documento', $usuario->getTipoDocumento(), PDO::PARAM_STR);
            $stmt->bindValue(':numero_documento', $usuario->getNumeroDocumento(), PDO::PARAM_STR);
            $stmt->bindValue(':telefono', $usuario->getTelefono(), PDO::PARAM_STR);
            $stmt->bindValue(':correo', $usuario->getCorreo(), PDO::PARAM_STR);
            $stmt->bindValue(':contrasena', $contrasenaEncriptada, PDO::PARAM_STR);
            $stmt->bindValue(':saldo', $usuario->getSaldo(), PDO::PARAM_STR);
            $stmt->bindValue(':estado', $usuario->getEstado(), PDO::PARAM_STR);
            
            // Ejecutar la consulta
            $stmt->execute();
            
            return true;
        } catch (Exception $e) {
            error_log("Error en crearUsuario: " . $e->getMessage());
            return "Error al crear el usuario: " . $e->getMessage();
        }
    }
    
    /**
     * Método para verificar si un correo ya existe en la base de datos
     * @param string $correo Correo a verificar
     * @return bool True si el correo ya existe, false en caso contrario
     */
    public function verificarCorreoExistente($correo) {
        try {
            $consulta = "SELECT COUNT(*) as total FROM usuarios WHERE correo = :correo";
            $stmt = $this->conexion->prepare($consulta);
            $stmt->bindParam(':correo', $correo, PDO::PARAM_STR);
            $stmt->execute();
            
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
            return ($resultado['total'] > 0);
        } catch (Exception $e) {
            error_log("Error en verificarCorreoExistente: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Método para verificar si un documento ya existe en la base de datos
     * @param string $documento Número de documento a verificar
     * @return bool True si el documento ya existe, false en caso contrario
     */
    public function verificarDocumentoExistente($documento) {
        try {
            $consulta = "SELECT COUNT(*) as total FROM usuarios WHERE numero_documento = :documento";
            $stmt = $this->conexion->prepare($consulta);
            $stmt->bindParam(':documento', $documento, PDO::PARAM_STR);
            $stmt->execute();
            
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
            return ($resultado['total'] > 0);
        } catch (Exception $e) {
            error_log("Error en verificarDocumentoExistente: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Método para autenticar un usuario
     * @param string $correo Correo electrónico del usuario
     * @param string $contrasena Contraseña del usuario
     * @return array|bool Información del usuario o false si falla la autenticación
     */
    public function autenticarUsuario($correo, $contrasena) {
        try {
            // Preparar la consulta
            $consulta = "SELECT * FROM usuarios WHERE correo = :correo AND estado = 'Activo' LIMIT 1";
            $stmt = $this->conexion->prepare($consulta);
            $stmt->bindParam(':correo', $correo, PDO::PARAM_STR);
            $stmt->execute();
            
            // Verificar si se encontró el usuario
            if ($stmt->rowCount() > 0) {
                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Verificar la contraseña
                if (password_verify($contrasena, $usuario['contrasena'])) {
                    return $usuario;
                }
            }
            
            return false;
        } catch (Exception $e) {
            error_log("Error en autenticarUsuario: " . $e->getMessage());
            return false;
        }
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
     * Método para obtener un usuario por su ID
     * @param int $idUsuario ID del usuario a buscar
     * @return array|null Datos del usuario o null si no se encuentra
     */
    public function obtenerUsuarioPorId($idUsuario) {
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
            error_log("Error en obtenerUsuarioPorId: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Método para buscar un usuario por su ID
     * @param int $idUsuario ID del usuario a buscar
     * @return array|null Datos del usuario o null si no se encuentra
     */
    public function buscarUsuarioPorId($idUsuario) {
        return $this->obtenerUsuarioPorId($idUsuario);
    }
    
    /**
     * Método para actualizar el saldo de un usuario
     * @param int $idUsuario ID del usuario
     * @param float $nuevoSaldo Nuevo saldo a establecer
     * @return boolean True si la actualización fue exitosa, False en caso contrario
     */
    public function actualizarSaldo($idUsuario, $nuevoSaldo) {
        try {
            // Preparar la consulta
            $consulta = "UPDATE usuarios SET saldo = :nuevo_saldo WHERE ID = :id_usuario";
            $stmt = $this->conexion->prepare($consulta);
            $stmt->bindParam(':nuevo_saldo', $nuevoSaldo, PDO::PARAM_STR);
            $stmt->bindParam(':id_usuario', $idUsuario, PDO::PARAM_INT);
            
            // Ejecutar la actualización
            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Error en actualizarSaldo: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Método para actualizar el saldo de un usuario (alias para mantener compatibilidad)
     * @param int $idUsuario ID del usuario
     * @param float $nuevoSaldo Nuevo saldo a establecer
     * @return boolean True si la actualización fue exitosa, False en caso contrario
     */
    public function actualizarSaldoUsuario($idUsuario, $nuevoSaldo) {
        return $this->actualizarSaldo($idUsuario, $nuevoSaldo);
    }
    
    /**
     * Método para actualizar la información de un usuario
     * @param Usuario $usuario Objeto Usuario con la información actualizada
     * @return bool True si la actualización es exitosa, false en caso contrario
     */
    public function actualizarUsuario($usuario) {
        try {
            // Preparar la consulta
            $consulta = "UPDATE usuarios SET 
                        nombre = :nombre, 
                        apellido = :apellido, 
                        sexo = :sexo, 
                        tipo_documento = :tipo_documento, 
                        numero_documento = :numero_documento, 
                        telefono = :telefono, 
                        correo = :correo 
                        WHERE ID = :id";
            
            $stmt = $this->conexion->prepare($consulta);
            
            // Asignar los parámetros
            $id = $usuario->getId();
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':nombre', $usuario->getNombre(), PDO::PARAM_STR);
            $stmt->bindParam(':apellido', $usuario->getApellido(), PDO::PARAM_STR);
            $stmt->bindParam(':sexo', $usuario->getSexo(), PDO::PARAM_STR);
            $stmt->bindParam(':tipo_documento', $usuario->getTipoDocumento(), PDO::PARAM_STR);
            $stmt->bindParam(':numero_documento', $usuario->getNumeroDocumento(), PDO::PARAM_STR);
            $stmt->bindParam(':telefono', $usuario->getTelefono(), PDO::PARAM_STR);
            $stmt->bindParam(':correo', $usuario->getCorreo(), PDO::PARAM_STR);
            
            // Ejecutar la actualización
            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Error en actualizarUsuario: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Método para cambiar el estado de un usuario (activar/desactivar)
     * @param int $idUsuario ID del usuario
     * @param string $nuevoEstado Nuevo estado ('Activo' o 'Inactivo')
     * @return bool True si el cambio es exitoso, false en caso contrario
     */
    public function cambiarEstadoUsuario($idUsuario, $nuevoEstado) {
        try {
            // Preparar la consulta
            $consulta = "UPDATE usuarios SET estado = :estado WHERE ID = :id_usuario";
            $stmt = $this->conexion->prepare($consulta);
            $stmt->bindParam(':estado', $nuevoEstado, PDO::PARAM_STR);
            $stmt->bindParam(':id_usuario', $idUsuario, PDO::PARAM_INT);
            
            // Ejecutar la actualización
            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Error en cambiarEstadoUsuario: " . $e->getMessage());
            return false;
        }
    }
}
?>