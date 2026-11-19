-- Este script corresponde a la estructura compartida: usuarios.rol es ENUM.
-- Si ya ejecutaste tu esquema completo, NO necesitas ejecutar este archivo.
USE sistema_ventas;

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('dueño', 'administrador', 'trabajador') NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- En el esquema compartido, ventas ya tiene id_usuario y su clave foránea.
-- Para una base antigua sin esa columna, agrégala una sola vez:
-- ALTER TABLE ventas ADD COLUMN id_usuario INT NULL;
-- ALTER TABLE ventas ADD CONSTRAINT fk_ventas_usuario
--   FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL;
