USE sistema_ventas;

CREATE TABLE IF NOT EXISTS roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE
);

INSERT INTO roles (nombre)
VALUES ('dueño'), ('administrador'), ('trabajador');

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

ALTER TABLE ventas
ADD COLUMN id_usuario INT NULL,
ADD CONSTRAINT fk_ventas_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario);
