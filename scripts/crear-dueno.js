require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

const consola = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function preguntar(texto) {
  return new Promise(resolve => consola.question(texto, resolve));
}

async function crearDueno() {
  try {
    const nombre = (await preguntar('Nombre del dueño: ')).trim();
    const correo = (await preguntar('Correo del dueño: ')).trim();
    const contrasena = await preguntar('Contraseña (mínimo 8 caracteres): ');

    if (!nombre || !correo || contrasena.length < 8) {
      throw new Error('Completa los datos y usa una contraseña de 8 caracteres o más.');
    }

    const hash = await bcrypt.hash(contrasena, 10);
    await pool.execute(`
      INSERT INTO usuarios (nombre, correo, contrasena, rol)
      VALUES (?, ?, ?, 'dueño')
    `, [nombre, correo, hash]);

    console.log('Cuenta de dueño creada. Ya puedes iniciar sesión.');
  } catch (error) {
    console.error('No se pudo crear el dueño:', error.message);
    process.exitCode = 1;
  } finally {
    consola.close();
    await pool.end();
  }
}

crearDueno();