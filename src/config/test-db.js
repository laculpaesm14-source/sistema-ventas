const pool = require('./db');

async function probarConexion() {
    try {
        const [rows] = await pool.execute('SELECT 1 + 1 AS resultado');
        console.log('Conexión exitosa a la base de datos. Resultado de prueba:', rows[0].resultado);
    } catch (error) {
        console.error('Error al probar la conexión a la base de datos:', error);
    }finally{
        await pool.end();
    }

}

probarConexion();
