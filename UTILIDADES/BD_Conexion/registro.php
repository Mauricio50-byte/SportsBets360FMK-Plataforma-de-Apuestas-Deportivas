<?php
/**
 * Script para procesar el registro de nuevos usuarios
 */

// Iniciar sesión
session_start();

// Variable para almacenar mensajes
$mensaje = '';
$tipo_mensaje = '';

// Verificar si ya hay una sesión activa
if (isset($_SESSION['usuario_id'])) {
    $mensaje = "Ya tienes una sesión activa. Redirigiendo a la página principal...";
    $tipo_mensaje = "info";
    // En lugar de redireccionar inmediatamente, mostraremos el mensaje
} 
// Verificar si es una petición POST (formulario enviado)
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Incluir el controlador de usuarios
    require_once(__DIR__ . '/../../CONTROLADORES/ControladorUsuario.php');
    
    // Obtener datos del formulario
    $datosUsuario = [
        'nombre' => isset($_POST['nombre']) ? trim($_POST['nombre']) : '',
        'apellido' => isset($_POST['apellido']) ? trim($_POST['apellido']) : '',
        'sexo' => isset($_POST['sexo']) ? $_POST['sexo'] : '',
        'tipo_documento' => isset($_POST['tipo_documento']) ? $_POST['tipo_documento'] : '',
        'numero_documento' => isset($_POST['numero_documento']) ? trim($_POST['numero_documento']) : '',
        'telefono' => isset($_POST['telefono']) ? trim($_POST['telefono']) : '',
        'email' => isset($_POST['email']) ? trim($_POST['email']) : '',
        'contrasena' => isset($_POST['contrasena']) ? $_POST['contrasena'] : '',
        'repetir_contrasena' => isset($_POST['repetir_contrasena']) ? $_POST['repetir_contrasena'] : '',
    ];
    
    // Crear instancia del controlador de usuarios
    $controladorUsuario = new ControladorUsuario();
    
    // Intentar registrar al usuario
    $resultado = $controladorUsuario->registrarUsuario($datosUsuario);

    // Verificar el resultado del registro
    if ($resultado === true) {
        // Registro exitoso
        $mensaje = "¡Registro exitoso! Tu cuenta ha sido creada correctamente.";
        $tipo_mensaje = "success";
        
        // Enviar correo de bienvenida (función definida abajo)
        if (isset($datosUsuario['nombre']) && isset($datosUsuario['email'])) {
            enviarCorreoBienvenida($datosUsuario['nombre'], $datosUsuario['email']);
            $mensaje .= " Se ha enviado un correo de bienvenida a tu dirección de email.";
        }
    } else {
        // Registro fallido
        $mensaje = "Error al registrar: " . $resultado;
        $tipo_mensaje = "error";
    }
} else {
    // Si no es una petición POST, mostrar mensaje para usar el formulario
    $mensaje = "Por favor, completa el formulario de registro para crear una cuenta.";
    $tipo_mensaje = "info";
}

/**
 * Función para validar el formato de la contraseña
 * Implementa reglas de seguridad para contraseñas
 * @param string $contrasena Contraseña a validar
 * @return bool True si la contraseña cumple con los requisitos, false en caso contrario
 */
function validarContrasena($contrasena) {
    // Verificar longitud mínima
    if (strlen($contrasena) < 8) {
        return false;
    }
    
    // Verificar que contenga al menos un número
    if (!preg_match('/[0-9]/', $contrasena)) {
        return false;
    }
    
    // Verificar que contenga al menos una letra mayúscula
    if (!preg_match('/[A-Z]/', $contrasena)) {
        return false;
    }
    
    // Verificar que contenga al menos una letra minúscula
    if (!preg_match('/[a-z]/', $contrasena)) {
        return false;
    }
    
    // Si pasa todas las validaciones
    return true;
}

/**
 * Función para enviar correo de bienvenida al nuevo usuario
 * @param string $nombre Nombre del usuario
 * @param string $correo Correo del usuario
 */
function enviarCorreoBienvenida($nombre, $correo) {
    // Para implementación futura:
    // Código para enviar correo electrónico de bienvenida
    // usando PHPMailer, mail() o alguna API de correo
    
    $asunto = "Bienvenido a SportsBets360FMK";
    $mensaje = "Hola $nombre,\n\n";
    $mensaje .= "Gracias por registrarte en SportsBets360FMK.\n";
    $mensaje .= "Tu cuenta ha sido creada con éxito.\n\n";
    $mensaje .= "Saludos,\n";
    $mensaje .= "El equipo de SportsBets360FMK";
    
    // Guarda en log para depuración
    error_log("Se enviaría correo de bienvenida a: $correo");
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

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SportsBets360FMK - Registro</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            text-align: center;
        }
        .message {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .info {
            background-color: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        .btn {
            display: inline-block;
            font-weight: 400;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            user-select: none;
            border: 1px solid transparent;
            padding: .375rem .75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: .25rem;
            transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
            color: #fff;
            background-color: #007bff;
            text-decoration: none;
            cursor: pointer;
        }
        .btn:hover {
            background-color: #0069d9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>SportsBets360FMK</h1>
        
        <?php if (!empty($mensaje)): ?>
            <div class="message <?php echo $tipo_mensaje; ?>">
                <?php echo $mensaje; ?>
            </div>
        <?php endif; ?>
        
        <div style="text-align: center; margin-top: 20px;">
            <?php if ($tipo_mensaje == 'success'): ?>
                <a href="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/View/index.html" class="btn">Ir a inicio de sesión</a>
            <?php elseif ($tipo_mensaje == 'info' && isset($_SESSION['usuario_id'])): ?>
                <p>Redirigiendo en <span id="countdown">5</span> segundos...</p>
                <script>
                    // Contador regresivo para redirigir
                    let seconds = 5;
                    const countdownElement = document.getElementById('countdown');
                    
                    const interval = setInterval(function() {
                        seconds--;
                        countdownElement.textContent = seconds;
                        
                        if (seconds <= 0) {
                            clearInterval(interval);
                            window.location.href = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/View/Menu.html';
                        }
                    }, 1000);
                </script>
            <?php else: ?>
                <a href="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/View/index.html" class="btn">Volver al formulario de registro</a>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>