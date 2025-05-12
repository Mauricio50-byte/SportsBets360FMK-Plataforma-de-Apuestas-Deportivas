<?php
/**
 * Clase de persistencia para la entidad Usuario
 * Gestiona todas las operaciones de base de datos relacionadas con usuarios
 */
class UsuarioPersistencia {
    private $conexion;
    
    /**
     * Constructor de la clase de persistencia
     */
    public function __construct() {
        // Incluir la clase de conexión
        require_once(__DIR__ . '/../../UTILIDADES/BD_Conexion/conexion.php');
        
        // Obtener la instancia de conexión
        $this->conexion = Conexion::obtenerInstancia()->obtenerConexion();
    }
    
    /**
     * Método para autenticar un usuario por correo y contraseña
     * @param string $correo Correo electrónico del usuario
     * @param string $contrasena Contraseña del usuario
     * @return array|bool Datos del usuario o false si falla la autenticación
     */
    public function autenticarUsuario($correo, $contrasena) {
        try {
            $sql = "SELECT * FROM usuarios WHERE correo = :correo AND estado = 'Activo'";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':correo', $correo, PDO::PARAM_STR);
            $stmt->execute();
            
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Verificar si el usuario existe y la contraseña es correcta
            if ($usuario && $contrasena === $usuario['contrasena']) {
                return $usuario;
            }
            
            return false;
        } catch (PDOException $e) {
            error_log("Error al autenticar usuario: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Método para crear un nuevo usuario en la base de datos
     * @param Usuario $usuario Objeto Usuario con los datos del nuevo usuario
     * @return bool|string True si el registro es exitoso, mensaje de error en caso contrario
     */
    public function crearUsuario($usuario) {
        try {
            // Verificar si el documento ya existe
            if ($this->verificarDocumentoExistente($usuario->getNumeroDocumento())) {
                return "El número de documento ya está registrado";
            }
            
            // Verificar si el correo ya existe
            if ($this->verificarCorreoExistente($usuario->getCorreo())) {
                return "El correo electrónico ya está registrado";
            }
            
            // Iniciar transacción
            $this->conexion->beginTransaction();
            
            $sql = "INSERT INTO usuarios (nombre, apellido, sexo, tipo_documento, numero_documento, 
                    telefono, correo, contrasena, saldo, estado) 
                    VALUES (:nombre, :apellido, :sexo, :tipo_documento, :numero_documento, 
                    :telefono, :correo, :contrasena, :saldo, :estado)";
            
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindValue(':nombre', $usuario->getNombre(), PDO::PARAM_STR);
            $stmt->bindValue(':apellido', $usuario->getApellido(), PDO::PARAM_STR);
            $stmt->bindValue(':sexo', $usuario->getSexo(), PDO::PARAM_STR);
            $stmt->bindValue(':tipo_documento', $usuario->getTipoDocumento(), PDO::PARAM_STR);
            $stmt->bindValue(':numero_documento', $usuario->getNumeroDocumento(), PDO::PARAM_STR);
            $stmt->bindValue(':telefono', $usuario->getTelefono(), PDO::PARAM_STR);
            $stmt->bindValue(':correo', $usuario->getCorreo(), PDO::PARAM_STR);
            $stmt->bindValue(':contrasena', $usuario->getContrasena(), PDO::PARAM_STR);
            $stmt->bindValue(':saldo', $usuario->getSaldo(), PDO::PARAM_STR);
            $stmt->bindValue(':estado', $usuario->getEstado(), PDO::PARAM_STR);
            
            $resultado = $stmt->execute();
            
            // Confirmar transacción
            $this->conexion->commit();
            
            return $resultado;
        } catch (PDOException $e) {
            // Revertir transacción en caso de error
            if ($this->conexion->inTransaction()) {
                $this->conexion->rollBack();
            }
            error_log("Error al crear usuario: " . $e->getMessage());
            return "Error al registrar usuario: " . $e->getMessage();
        }
    }
    
    /**
     * Método para obtener un usuario por su ID
     * @param int $idUsuario ID del usuario
     * @return array|bool Datos del usuario o false si no existe
     */
    public function obtenerUsuarioPorId($idUsuario) {
        try {
            $sql = "SELECT * FROM usuarios WHERE ID = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id', $idUsuario, PDO::PARAM_INT);
            $stmt->execute();
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error al obtener usuario por ID: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Método para verificar si un documento ya está registrado
     * @param string $documento Número de documento a verificar
     * @return bool True si el documento ya existe, false en caso contrario
     */
    public function verificarDocumentoExistente($documento) {
        try {
            $sql = "SELECT COUNT(*) FROM usuarios WHERE numero_documento = :documento";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':documento', $documento, PDO::PARAM_STR);
            $stmt->execute();
            
            return $stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            error_log("Error al verificar documento: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Método para verificar si un correo ya está registrado
     * @param string $correo Correo a verificar
     * @return bool True si el correo ya existe, false en caso contrario
     */
    public function verificarCorreoExistente($correo) {
        try {
            $sql = "SELECT COUNT(*) FROM usuarios WHERE correo = :correo";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':correo', $correo, PDO::PARAM_STR);
            $stmt->execute();
            
            return $stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            error_log("Error al verificar correo: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Método para actualizar el saldo de un usuario
     * @param int $idUsuario ID del usuario
     * @param float $nuevoSaldo Nuevo saldo del usuario
     * @return bool True si la actualización es exitosa, false en caso contrario
     */
    public function actualizarSaldo($idUsuario, $nuevoSaldo) {
        try {
            $sql = "UPDATE usuarios SET saldo = :saldo WHERE ID = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':saldo', $nuevoSaldo, PDO::PARAM_STR);
            $stmt->bindParam(':id', $idUsuario, PDO::PARAM_INT);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error al actualizar saldo: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Método para actualizar la información de un usuario
     * @param Usuario $usuario Objeto Usuario con la información actualizada
     * @return bool True si la actualización es exitosa, false en caso contrario
     */
    public function actualizarUsuario($usuario) {
        try {
            $sql = "UPDATE usuarios SET nombre = :nombre, apellido = :apellido, 
                    sexo = :sexo, tipo_documento = :tipo_documento, 
                    telefono = :telefono, contrasena = :contrasena 
                    WHERE ID = :id";
            
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindValue(':nombre', $usuario->getNombre(), PDO::PARAM_STR);
            $stmt->bindValue(':apellido', $usuario->getApellido(), PDO::PARAM_STR);
            $stmt->bindValue(':sexo', $usuario->getSexo(), PDO::PARAM_STR);
            $stmt->bindValue(':tipo_documento', $usuario->getTipoDocumento(), PDO::PARAM_STR);
            $stmt->bindValue(':telefono', $usuario->getTelefono(), PDO::PARAM_STR);
            $stmt->bindValue(':contrasena', $usuario->getContrasena(), PDO::PARAM_STR);
            $stmt->bindValue(':id', $usuario->getId(), PDO::PARAM_INT);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error al actualizar usuario: " . $e->getMessage());
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
            $sql = "UPDATE usuarios SET estado = :estado WHERE ID = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':estado', $nuevoEstado, PDO::PARAM_STR);
            $stmt->bindParam(':id', $idUsuario, PDO::PARAM_INT);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error al cambiar estado de usuario: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Método para listar todos los usuarios
     * @param string $filtro Filtro opcional para la búsqueda
     * @return array Lista de usuarios o array vacío si hay error
     */
    public function listarUsuarios($filtro = '') {
        try {
            $sql = "SELECT * FROM usuarios";
            
            if (!empty($filtro)) {
                $sql .= " WHERE nombre LIKE :filtro OR apellido LIKE :filtro OR 
                        correo LIKE :filtro OR numero_documento LIKE :filtro";
                $stmt = $this->conexion->prepare($sql);
                $filtroParam = "%$filtro%";
                $stmt->bindParam(':filtro', $filtroParam, PDO::PARAM_STR);
            } else {
                $stmt = $this->conexion->prepare($sql);
            }
            
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error al listar usuarios: " . $e->getMessage());
            return [];
        }
    }
}
?>