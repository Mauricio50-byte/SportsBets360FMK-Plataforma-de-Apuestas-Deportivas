<?php
/**
 * Script para actualizar datos del usuario
 */

// Iniciar sesión
session_start();

// Establecer encabezados para CORS y respuesta JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Permitir peticiones preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Verificar si hay una sesión activa
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'No hay sesión activa'
    ]);
    exit;
}

// Verificar si es una petición POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener y decodificar datos JSON
    $jsonData = file_get_contents('php://input');
    $datosUsuario = json_decode($jsonData, true);
    
    if (!$datosUsuario) {
        echo json_encode([
            'success' => false,
            'message' => 'Datos inválidos'
        ]);
        exit;
    }
    
    // Debug: Ver los datos recibidos
    error_log("Datos recibidos para actualizar: " . print_r($datosUsuario, true));
    
    try {
        // Corregir la ruta de inclusión del controlador
        $rutaBase = $_SERVER['DOCUMENT_ROOT'] . '/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/';
        $rutaControlador = $rutaBase . 'CONTROLADORES/ControladorUsuario.php';
        
        // Verificar si el archivo existe antes de incluirlo
        if (!file_exists($rutaControlador)) {
            echo json_encode([
                'success' => false,
                'message' => 'Error: No se encontró el controlador de usuarios en: ' . $rutaControlador
            ]);
            exit;
        }
        
        // Incluir el controlador de usuarios
        require_once($rutaControlador);
        
        // Crear instancia del controlador
        $controladorUsuario = new ControladorUsuario();
        
        // Corregir la ruta del modelo Usuario
        $rutaModelo = $rutaBase . 'MODELO/Entidades/Usuario.php';
        
        // Verificar si el archivo existe antes de incluirlo
        if (!file_exists($rutaModelo)) {
            echo json_encode([
                'success' => false,
                'message' => 'Error: No se encontró el modelo de Usuario en: ' . $rutaModelo
            ]);
            exit;
        }
        
        // Incluir el modelo Usuario
        require_once($rutaModelo);
        
        // Asegurarse de que el campo sexo sea un solo carácter (M o F)
        if (isset($datosUsuario['sexo'])) {
            if (strtoupper($datosUsuario['sexo']) === 'MASCULINO' || strtoupper($datosUsuario['sexo']) === 'M') {
                $datosUsuario['sexo'] = 'M';
            } else if (strtoupper($datosUsuario['sexo']) === 'FEMENINO' || strtoupper($datosUsuario['sexo']) === 'F') {
                $datosUsuario['sexo'] = 'F';
            } else {
                $datosUsuario['sexo'] = 'M'; // Valor por defecto
            }
        }
        
        // Crear objeto Usuario con los datos actualizados
        $usuario = new Usuario();
        $usuario->setId($_SESSION['usuario_id'])
                ->setNombre($datosUsuario['nombre'])
                ->setApellido($datosUsuario['apellido'])
                ->setSexo($datosUsuario['sexo'])
                ->setTipoDocumento($datosUsuario['tipo_documento'])
                ->setNumeroDocumento($datosUsuario['numero_documento'])
                ->setTelefono($datosUsuario['telefono'])
                ->setCorreo($datosUsuario['correo']);
        
        // Debug: Registrar datos del usuario antes de actualizar
        error_log("Datos del usuario antes de actualizar: " .
                  "ID: " . $usuario->getId() . ", " .
                  "Nombre: " . $usuario->getNombre() . ", " .
                  "Sexo: " . $usuario->getSexo());
        
        // Intentar actualizar los datos
        $resultado = $controladorUsuario->actualizarUsuario($usuario);
        
        if ($resultado === true) {
            // Actualizar datos en la sesión
            $_SESSION['usuario_nombre'] = $datosUsuario['nombre'];
            $_SESSION['usuario_apellido'] = $datosUsuario['apellido'];
            $_SESSION['usuario_correo'] = $datosUsuario['correo'];
            $_SESSION['usuario_documento'] = $datosUsuario['numero_documento'];
            $_SESSION['usuario_telefono'] = $datosUsuario['telefono'];
            
            echo json_encode([
                'success' => true,
                'message' => 'Datos actualizados correctamente'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Error al actualizar los datos: ' . $resultado
            ]);
        }
    } catch (Exception $e) {
        error_log("Excepción en actualizar_usuario.php: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?>