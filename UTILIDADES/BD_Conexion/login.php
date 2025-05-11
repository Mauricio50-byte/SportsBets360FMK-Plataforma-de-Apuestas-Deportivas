<?php
/**
 * Script para procesar el inicio de sesión de usuarios
 */

// Iniciar sesión
session_start();

// Verificar si ya hay una sesión activa
if (isset($_SESSION['usuario_id'])) {
    // Redirigir a la página principal del usuario
    header('Location: http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/View/Menu.html');
    exit;
}

// Verificar si es una petición POST (formulario enviado)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Incluir el controlador de usuarios
    require_once(__DIR__ . '/../../CONTROLADORES/ControladorUsuario.php');
    
    // Obtener datos del formulario
    $correo = isset($_POST['correo']) ? trim($_POST['correo']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    
    // Validar que los campos no estén vacíos
    if (empty($correo) || empty($password)) {
        // Redirigir con mensaje de error
        header('Location: /index.html?error=campos_vacios');
        exit;
    }
    
    // Crear instancia del controlador de usuarios
    $controladorUsuario = new ControladorUsuario();
    
    // Intentar autenticar al usuario
    $usuario = $controladorUsuario->autenticarUsuario($correo, $password);
    
    if ($usuario) {
        // Autenticación exitosa, iniciar sesión
        $_SESSION['usuario_id'] = $usuario['ID'];
        $_SESSION['usuario_nombre'] = $usuario['nombre'];
        $_SESSION['usuario_apellido'] = $usuario['apellido'];
        $_SESSION['usuario_correo'] = $usuario['correo'];
        $_SESSION['usuario_saldo'] = $usuario['saldo'];
        $_SESSION['usuario_documento'] = $usuario['numero_documento'];
        $_SESSION['ultimo_acceso'] = time();
        
        // Redireccionar al menú principal
        header('Location: http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/View/Menu.html');
        exit;
    } else {
        // Autenticación fallida, mostrar mensaje de error
        header('Location: http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/View/index.html?error=credenciales_invalidas');
        exit;
    }
} else {
    // Si no es una petición POST, redirigir a la página de inicio
    header('Location: http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/View/index.html');
    exit;
}

/**
 * Función para registrar el intento fallido de inicio de sesión
 * Puede implementarse para bloquear cuentas después de varios intentos fallidos
 * @param string $correo Correo del intento fallido
 */
function registrarIntentoFallido($correo) {
    // Implementación futura para registro de intentos fallidos
    // Por ejemplo, guardar en una tabla de la base de datos
    // con timestamp, IP, etc.
    error_log("Intento fallido de inicio de sesión para el correo: $correo en " . date('Y-m-d H:i:s'));
}

/**
 * Función para sanitizar datos de entrada
 * @param string $data Datos a sanitizar
 * @return string Datos sanitizados
 */
function sanitizarDatos($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>