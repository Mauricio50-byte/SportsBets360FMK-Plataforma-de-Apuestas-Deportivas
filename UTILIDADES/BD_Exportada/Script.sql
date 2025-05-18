-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS bd_pltf_apuestas;
USE bd_pltf_apuestas;

-- Configuración del modo SQL y zona horaria
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- Estructura de la tabla usuarios
CREATE TABLE usuarios (
  ID int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  apellido varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  sexo enum('Masculino','Femenino') COLLATE utf8_unicode_ci NOT NULL,
  tipo_documento enum('CC','CE') COLLATE utf8_unicode_ci NOT NULL,
  numero_documento varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  telefono varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  correo varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  contrasena varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  saldo double NOT NULL DEFAULT '0',
  estado enum('Activo','Inactivo') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Activo',
  fecha_registro datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ID),
  UNIQUE KEY numero_documento (numero_documento),
  UNIQUE KEY correo (correo),
  KEY idx_documento (numero_documento),
  KEY idx_correo (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Estructura de la tabla recargas
CREATE TABLE recargas (
  ID_recarga int(11) NOT NULL AUTO_INCREMENT,
  ID_usuario int(11) NOT NULL,
  Documento_usuario varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  Correo_usuario varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  Fecha_recarga date NOT NULL,
  Monto_recarga double NOT NULL,
  Saldo double NOT NULL,
  PRIMARY KEY (ID_recarga),
  KEY ID_usuario (ID_usuario),
  KEY Correo_usuario (Correo_usuario),
  KEY idx_doc_usuario_recargas (Documento_usuario),
  CONSTRAINT recargas_ibfk_1 FOREIGN KEY (ID_usuario) REFERENCES usuarios (ID) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT recargas_ibfk_2 FOREIGN KEY (Documento_usuario) REFERENCES usuarios (numero_documento) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT recargas_ibfk_3 FOREIGN KEY (Correo_usuario) REFERENCES usuarios (correo) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Estructura de la tabla retiros
CREATE TABLE retiros (
  ID_retiro int(11) NOT NULL AUTO_INCREMENT,
  ID_usuario int(11) NOT NULL,
  Documento_usuario varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  Correo_usuario varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  Fecha_retiro date NOT NULL,
  Monto_retiro double NOT NULL,
  Saldo double NOT NULL,
  PRIMARY KEY (ID_retiro),
  KEY ID_usuario (ID_usuario),
  KEY Correo_usuario (Correo_usuario),
  KEY idx_doc_usuario_retiros (Documento_usuario),
  CONSTRAINT retiros_ibfk_1 FOREIGN KEY (ID_usuario) REFERENCES usuarios (ID) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT retiros_ibfk_2 FOREIGN KEY (Documento_usuario) REFERENCES usuarios (numero_documento) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT retiros_ibfk_3 FOREIGN KEY (Correo_usuario) REFERENCES usuarios (correo) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Estructura de la tabla transacciones
CREATE TABLE transacciones (
  id int(11) NOT NULL AUTO_INCREMENT,
  id_usuario int(11) NOT NULL,
  tipo enum('recarga','retiro') COLLATE utf8mb4_unicode_ci NOT NULL,
  monto decimal(10,2) NOT NULL,
  fecha datetime NOT NULL,
  PRIMARY KEY (id),
  KEY id_usuario (id_usuario),
  CONSTRAINT transacciones_ibfk_1 FOREIGN KEY (id_usuario) REFERENCES usuarios (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Creación de la vista vista_recargas
CREATE OR REPLACE VIEW vista_recargas AS
SELECT 
  r.ID_recarga AS ID_recarga,
  u.ID AS ID_usuario,
  u.nombre AS Nombre,
  u.apellido AS Apellido,
  u.numero_documento AS Documento,
  r.Fecha_recarga AS Fecha_recarga,
  r.Monto_recarga AS Monto_recarga,
  r.Saldo AS Saldo
FROM 
  (recargas r 
  JOIN usuarios u ON ((r.ID_usuario = u.ID)));

-- Creación de la vista vista_retiros
CREATE OR REPLACE VIEW vista_retiros AS
SELECT 
  r.ID_retiro AS ID_retiro,
  u.ID AS ID_usuario,
  u.nombre AS Nombre,
  u.apellido AS Apellido,
  u.numero_documento AS Documento,
  r.Fecha_retiro AS Fecha_retiro,
  r.Monto_retiro AS Monto_retiro,
  r.Saldo AS Saldo
FROM 
  (retiros r 
  JOIN usuarios u ON ((r.ID_usuario = u.ID)));

-- Creación de la vista historial_transacciones
CREATE OR REPLACE VIEW historial_transacciones AS
SELECT 
  u.ID AS ID_usuario,
  u.nombre AS Nombre,
  u.apellido AS Apellido,
  u.numero_documento AS Documento,
  'Recarga' AS Tipo_Transaccion,
  r.ID_recarga AS ID_Transaccion,
  r.Fecha_recarga AS Fecha,
  r.Monto_recarga AS Monto,
  r.Saldo AS Saldo_Final
FROM 
  (recargas r 
  JOIN usuarios u ON ((r.ID_usuario = u.ID)))
UNION ALL
SELECT 
  u.ID AS ID_usuario,
  u.nombre AS Nombre,
  u.apellido AS Apellido,
  u.numero_documento AS Documento,
  'Retiro' AS Tipo_Transaccion,
  ret.ID_retiro AS ID_Transaccion,
  ret.Fecha_retiro AS Fecha,
  ret.Monto_retiro AS Monto,
  ret.Saldo AS Saldo_Final
FROM 
  (retiros ret 
  JOIN usuarios u ON ((ret.ID_usuario = u.ID)))
ORDER BY ID_usuario, Fecha;