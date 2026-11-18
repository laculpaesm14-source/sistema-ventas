const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

async function crearDueno() {
  const nombre = process.argv[2];
  const correo = process.argv[3];
  const contrasena = process.argv[4];

  if (!nombre || !correo || !contrasena) {
    console.error(
      'Uso: npm run crear-dueno -- "Nombre" "correo" "contrasena"'
    );
    process.exit(1);
  }

  if (contrasena.length < 8) {
    console.error('La contraseña debe tener al menos 8 caracteres.');
    process.exit(1);
  }

  try {
    const [roles] = await pool.execute(
      'SELECT id_rol FROM roles WHERE nombre = ?',
      ['dueño']
    );

    if (!roles[0]) {
      throw new Error('Primero ejecuta database-usuarios.sql.');
    }

    const contrasenaHash = await bcrypt.hash(contrasena, 10);

    await pool.execute(`
      INSERT INTO usuarios (nombre, correo, contrasena, id_rol)
      VALUES (?, ?, ?, ?)
    `, [nombre, correo, contrasenaHash, roles[0].id_rol]);

    console.log('Usuario dueño creado correctamente.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

crearDueno();
