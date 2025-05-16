<?php
/**
 * Script para verificar si hay una sesión activa del usuario
 */

// Iniciar sesión
session_start();

// Establecer encabezados para respuesta JSON
header('Content-Type: application/json');

// Verificar si hay una sesión activa
if (isset($_SESSION['usuario_id'])) {
    // Usuario logueado, devolver datos
    echo json_encode([
        'loggedIn' => true,
        'id' => $_SESSION['usuario_id'],
        'nombre' => $_SESSION['usuario_nombre'],
        'apellido' => $_SESSION['usuario_apellido'],
        'correo' => $_SESSION['usuario_correo'],
        'saldo' => $_SESSION['usuario_saldo'],
        'documento' => $_SESSION['usuario_documento'],
        'telefono' => isset($_SESSION['usuario_telefono']) ? $_SESSION['usuario_telefono'] : '' // Agregar teléfono a la respuesta
    ]);
} else {
    // No hay sesión activa
    echo json_encode([
        'loggedIn' => false
    ]);
}
?>