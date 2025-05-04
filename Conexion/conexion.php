<?php
$host = "localhost";
$user = "root"; // Cambia esto si usas otro usuario
$password = ""; // Cambia esto si tienes una contraseña
$database = "SportBest360FMK";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>