<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $primer_nombre = $_POST['primer_nombre'];
    $segundo_nombre = $_POST['segundo_nombre'];
    $primer_apellido = $_POST['primer_apellido'];
    $segundo_apellido = $_POST['segundo_apellido'];
    $sexo = $_POST['sexo'];
    $tipo_documento = $_POST['tipo_documento'];
    $numero_documento = $_POST['numero_documento'];
    $telefono = $_POST['telefono'];
    $departamento = $_POST['departamento'];
    $email = $_POST['email'];
    $contrasena = password_hash($_POST['contrasena'], PASSWORD_DEFAULT); // Encripta la contraseña

    $sql = "INSERT INTO usuarios (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, 
            sexo, tipo_documento, numero_documento, telefono, departamento, email, contrasena) 
            VALUES ('$primer_nombre', '$segundo_nombre', '$primer_apellido', '$segundo_apellido', 
            '$sexo', '$tipo_documento', '$numero_documento', '$telefono', '$departamento', '$email', '$contrasena')";

    if ($conn->query($sql) === TRUE) {
        echo "Registro exitoso. <a href='index.html'>Iniciar Sesión</a>";
    } else {
        echo "Error: " . $conn->error;
    }

    $conn->close();
}
?>
