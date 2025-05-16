<?php
/**
 * Controlador para gestionar las operaciones relacionadas con usuarios
 * Implementa la lógica de negocio relacionada con los usuarios
 */
class ControladorUsuario {
    private $usuarioPersistencia;
    
    /**
     * Constructor del controlador de usuarios
     */
    public function __construct() {
        // Inicializar la capa de persistencia
        require_once(__DIR__ . '/../MODELO/Persistencia/UsuarioPersistencia.php');
        $this->usuarioPersistencia = new UsuarioPersistencia();
    }
    
    /**
     * Método para autenticar un usuario
     * @param string $correo Correo electrónico del usuario
     * @param string $contrasena Contraseña del usuario
     * @return array|bool Información del usuario o false si falla la autenticación
     */
    public function autenticarUsuario($correo, $contrasena) {
        // Validar que los datos no estén vacíos
        if (empty($correo) || empty($contrasena)) {
            return false;
        }
        
        // Sanitizar entradas
        $correo = filter_var($correo, FILTER_SANITIZE_EMAIL);
        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            return false;
        }
        
        // Llamar a la capa de persistencia para autenticar
        return $this->usuarioPersistencia->autenticarUsuario($correo, $contrasena);
    }
    
    /**
     * Método para registrar un nuevo usuario
     * @param array $datosUsuario Array con los datos del usuario a registrar
     * @return bool|string True si el registro es exitoso, mensaje de error en caso contrario
     */
    public function registrarUsuario($datosUsuario) {
        // Validar datos requeridos
        $camposRequeridos = ['nombre', 'apellido', 'sexo', 'tipo_documento', 
                            'numero_documento', 'telefono', 'email', 'contrasena'];
        foreach ($camposRequeridos as $campo) {
            if (!isset($datosUsuario[$campo]) || empty($datosUsuario[$campo])) {
                return "El campo $campo es obligatorio";
            }
        }
        
        // Validar correo electrónico
        $correo = filter_var($datosUsuario['email'], FILTER_SANITIZE_EMAIL);
        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            return "El correo electrónico no es válido";
        }
        
        // Validar que las contraseñas coincidan
        if (isset($datosUsuario['repetir_contrasena']) && 
            $datosUsuario['contrasena'] !== $datosUsuario['repetir_contrasena']) {
            return "Las contraseñas no coinciden";
        }
        
        // Validar documento (solo números)
        if (!preg_match('/^[0-9]+$/', $datosUsuario['numero_documento'])) {
            return "El número de documento solo debe contener números";
        }
        
        // Crear objeto Usuario
        require_once(__DIR__ . '/../MODELO/Entidades/Usuario.php');
        $usuario = new Usuario();
        $usuario->setNombre($datosUsuario['nombre'])
                ->setApellido($datosUsuario['apellido'])
                ->setSexo($datosUsuario['sexo'])
                ->setTipoDocumento($datosUsuario['tipo_documento'])
                ->setNumeroDocumento($datosUsuario['numero_documento'])
                ->setTelefono($datosUsuario['telefono'])
                ->setCorreo($datosUsuario['email'])
                ->setContrasena($datosUsuario['contrasena'])
                ->setSaldo(0)
                ->setEstado('Activo');
        
        // Llamar a la capa de persistencia para guardar
        return $this->usuarioPersistencia->crearUsuario($usuario);
    }
    
    /**
     * Método para obtener los datos de un usuario por su ID
     * @param int $idUsuario ID del usuario
     * @return array|bool Datos del usuario o false si no existe
     */
    public function obtenerUsuarioPorId($idUsuario) {
        if (!is_numeric($idUsuario) || $idUsuario <= 0) {
            return false;
        }
        
        return $this->usuarioPersistencia->obtenerUsuarioPorId($idUsuario);
    }
    
    /**
     * Método para verificar si un documento ya está registrado
     * @param string $documento Número de documento a verificar
     * @return bool True si el documento ya existe, false en caso contrario
     */
    public function verificarDocumentoExistente($documento) {
        return $this->usuarioPersistencia->verificarDocumentoExistente($documento);
    }
    
    /**
     * Método para verificar si un correo ya está registrado
     * @param string $correo Correo a verificar
     * @return bool True si el correo ya existe, false en caso contrario
     */
    public function verificarCorreoExistente($correo) {
        return $this->usuarioPersistencia->verificarCorreoExistente($correo);
    }
    
    /**
     * Método para actualizar el saldo del usuario
     * @param int $idUsuario ID del usuario
     * @param float $nuevoSaldo Nuevo saldo del usuario
     * @return bool True si la actualización es exitosa, false en caso contrario
     */
    public function actualizarSaldo($idUsuario, $nuevoSaldo) {
        if (!is_numeric($idUsuario) || $idUsuario <= 0 || !is_numeric($nuevoSaldo) || $nuevoSaldo < 0) {
            return false;
        }
        
        return $this->usuarioPersistencia->actualizarSaldo($idUsuario, $nuevoSaldo);
    }
    
    /**
     * Método para actualizar la información de un usuario
     * @param Usuario $usuario Objeto Usuario con la información actualizada
     * @return bool True si la actualización es exitosa, false en caso contrario
     */
    public function actualizarUsuario($usuario) {
        if (!$usuario || !$usuario->getId()) {
            return false;
        }
        
        return $this->usuarioPersistencia->actualizarUsuario($usuario);
    }
    
    /**
     * Método para cambiar el estado de un usuario (activar/desactivar)
     * @param int $idUsuario ID del usuario
     * @param string $nuevoEstado Nuevo estado ('Activo' o 'Inactivo')
     * @return bool True si el cambio es exitoso, false en caso contrario
     */
    public function cambiarEstadoUsuario($idUsuario, $nuevoEstado) {
        if (!is_numeric($idUsuario) || $idUsuario <= 0 || 
            !in_array($nuevoEstado, ['Activo', 'Inactivo'])) {
            return false;
        }
        
        return $this->usuarioPersistencia->cambiarEstadoUsuario($idUsuario, $nuevoEstado);
    }
}
?>