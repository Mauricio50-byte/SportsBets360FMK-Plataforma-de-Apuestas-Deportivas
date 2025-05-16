-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3333
-- Tiempo de generación: 16-05-2025 a las 21:53:15
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_pltf_apuestas`
--

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `historial_transacciones`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `historial_transacciones` (
`ID_usuario` int(11)
,`Nombre` varchar(255)
,`Apellido` varchar(255)
,`Documento` varchar(255)
,`Tipo_Transaccion` varchar(7)
,`ID_Transaccion` int(11)
,`Fecha` date
,`Monto` double
,`Saldo_Final` double
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recargas`
--

CREATE TABLE `recargas` (
  `ID_recarga` int(11) NOT NULL,
  `ID_usuario` int(11) NOT NULL,
  `Documento_usuario` varchar(255) NOT NULL,
  `Correo_usuario` varchar(255) NOT NULL,
  `Fecha_recarga` date NOT NULL,
  `Monto_recarga` double NOT NULL,
  `Saldo` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `recargas`
--

INSERT INTO `recargas` (`ID_recarga`, `ID_usuario`, `Documento_usuario`, `Correo_usuario`, `Fecha_recarga`, `Monto_recarga`, `Saldo`) VALUES
(1, 1, '051736741', 'mauro@gmail.com', '2025-05-14', 1000, 1000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `retiros`
--

CREATE TABLE `retiros` (
  `ID_retiro` int(11) NOT NULL,
  `ID_usuario` int(11) NOT NULL,
  `Documento_usuario` varchar(255) NOT NULL,
  `Correo_usuario` varchar(255) NOT NULL,
  `Fecha_retiro` date NOT NULL,
  `Monto_retiro` double NOT NULL,
  `Saldo` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `retiros`
--

INSERT INTO `retiros` (`ID_retiro`, `ID_usuario`, `Documento_usuario`, `Correo_usuario`, `Fecha_retiro`, `Monto_retiro`, `Saldo`) VALUES
(1, 1, '051736741', 'mauro@gmail.com', '2025-05-14', 1000, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transacciones`
--

CREATE TABLE `transacciones` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo` enum('recarga','retiro') NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `transacciones`
--

INSERT INTO `transacciones` (`id`, `id_usuario`, `tipo`, `monto`, `fecha`) VALUES
(1, 1, 'recarga', 100.00, '2025-05-14 18:12:22'),
(2, 1, 'retiro', 100.00, '2025-05-14 18:12:32'),
(3, 1, 'recarga', 1000.00, '2025-05-14 18:13:35'),
(4, 1, 'retiro', 1000.00, '2025-05-14 18:25:00'),
(5, 1, 'recarga', 1000.00, '2025-05-14 18:26:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `ID` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `sexo` enum('Masculino','Femenino') NOT NULL,
  `tipo_documento` enum('CC','CE') NOT NULL,
  `numero_documento` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `saldo` double NOT NULL DEFAULT 0,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`ID`, `nombre`, `apellido`, `sexo`, `tipo_documento`, `numero_documento`, `telefono`, `correo`, `contrasena`, `saldo`, `estado`, `fecha_registro`) VALUES
(1, 'mauricio', 'vergara fonseca', 'Masculino', 'CC', '051736741', '3215017923', 'mauro@gmail.com', '$2y$10$aFJOe7WHYoEoiNcJq.MtoebJktokEQIW41du7.rrLfvElUL2dOtfy', 1000, 'Activo', '2025-05-14 17:49:02');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_recargas`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_recargas` (
`ID_recarga` int(11)
,`ID_usuario` int(11)
,`Nombre` varchar(255)
,`Apellido` varchar(255)
,`Documento` varchar(255)
,`Fecha_recarga` date
,`Monto_recarga` double
,`Saldo` double
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_retiros`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_retiros` (
`ID_retiro` int(11)
,`ID_usuario` int(11)
,`Nombre` varchar(255)
,`Apellido` varchar(255)
,`Documento` varchar(255)
,`Fecha_retiro` date
,`Monto_retiro` double
,`Saldo` double
);

-- --------------------------------------------------------

--
-- Estructura para la vista `historial_transacciones`
--
DROP TABLE IF EXISTS `historial_transacciones`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `historial_transacciones`  AS SELECT `u`.`ID` AS `ID_usuario`, `u`.`nombre` AS `Nombre`, `u`.`apellido` AS `Apellido`, `u`.`numero_documento` AS `Documento`, 'Recarga' AS `Tipo_Transaccion`, `r`.`ID_recarga` AS `ID_Transaccion`, `r`.`Fecha_recarga` AS `Fecha`, `r`.`Monto_recarga` AS `Monto`, `r`.`Saldo` AS `Saldo_Final` FROM (`recargas` `r` join `usuarios` `u` on(`r`.`ID_usuario` = `u`.`ID`))union all select `u`.`ID` AS `ID_usuario`,`u`.`nombre` AS `Nombre`,`u`.`apellido` AS `Apellido`,`u`.`numero_documento` AS `Documento`,'Retiro' AS `Tipo_Transaccion`,`ret`.`ID_retiro` AS `ID_Transaccion`,`ret`.`Fecha_retiro` AS `Fecha`,`ret`.`Monto_retiro` AS `Monto`,`ret`.`Saldo` AS `Saldo_Final` from (`retiros` `ret` join `usuarios` `u` on(`ret`.`ID_usuario` = `u`.`ID`)) order by `ID_usuario`,`Fecha`  ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_recargas`
--
DROP TABLE IF EXISTS `vista_recargas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_recargas`  AS SELECT `r`.`ID_recarga` AS `ID_recarga`, `u`.`ID` AS `ID_usuario`, `u`.`nombre` AS `Nombre`, `u`.`apellido` AS `Apellido`, `u`.`numero_documento` AS `Documento`, `r`.`Fecha_recarga` AS `Fecha_recarga`, `r`.`Monto_recarga` AS `Monto_recarga`, `r`.`Saldo` AS `Saldo` FROM (`recargas` `r` join `usuarios` `u` on(`r`.`ID_usuario` = `u`.`ID`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_retiros`
--
DROP TABLE IF EXISTS `vista_retiros`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_retiros`  AS SELECT `r`.`ID_retiro` AS `ID_retiro`, `u`.`ID` AS `ID_usuario`, `u`.`nombre` AS `Nombre`, `u`.`apellido` AS `Apellido`, `u`.`numero_documento` AS `Documento`, `r`.`Fecha_retiro` AS `Fecha_retiro`, `r`.`Monto_retiro` AS `Monto_retiro`, `r`.`Saldo` AS `Saldo` FROM (`retiros` `r` join `usuarios` `u` on(`r`.`ID_usuario` = `u`.`ID`)) ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `recargas`
--
ALTER TABLE `recargas`
  ADD PRIMARY KEY (`ID_recarga`),
  ADD KEY `ID_usuario` (`ID_usuario`),
  ADD KEY `Correo_usuario` (`Correo_usuario`),
  ADD KEY `idx_doc_usuario_recargas` (`Documento_usuario`);

--
-- Indices de la tabla `retiros`
--
ALTER TABLE `retiros`
  ADD PRIMARY KEY (`ID_retiro`),
  ADD KEY `ID_usuario` (`ID_usuario`),
  ADD KEY `Correo_usuario` (`Correo_usuario`),
  ADD KEY `idx_doc_usuario_retiros` (`Documento_usuario`);

--
-- Indices de la tabla `transacciones`
--
ALTER TABLE `transacciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `numero_documento` (`numero_documento`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `idx_documento` (`numero_documento`),
  ADD KEY `idx_correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `recargas`
--
ALTER TABLE `recargas`
  MODIFY `ID_recarga` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `retiros`
--
ALTER TABLE `retiros`
  MODIFY `ID_retiro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `transacciones`
--
ALTER TABLE `transacciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `recargas`
--
ALTER TABLE `recargas`
  ADD CONSTRAINT `recargas_ibfk_1` FOREIGN KEY (`ID_usuario`) REFERENCES `usuarios` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `recargas_ibfk_2` FOREIGN KEY (`Documento_usuario`) REFERENCES `usuarios` (`numero_documento`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `recargas_ibfk_3` FOREIGN KEY (`Correo_usuario`) REFERENCES `usuarios` (`correo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `retiros`
--
ALTER TABLE `retiros`
  ADD CONSTRAINT `retiros_ibfk_1` FOREIGN KEY (`ID_usuario`) REFERENCES `usuarios` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `retiros_ibfk_2` FOREIGN KEY (`Documento_usuario`) REFERENCES `usuarios` (`numero_documento`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `retiros_ibfk_3` FOREIGN KEY (`Correo_usuario`) REFERENCES `usuarios` (`correo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `transacciones`
--
ALTER TABLE `transacciones`
  ADD CONSTRAINT `transacciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
