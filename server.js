require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = Number(process.env.PORT || 3000);

async function iniciarServidor() {
    try {
        const connection = await pool.getConnection();
        console.log('base de datos conectada correctamente');
        app.listen(PORT, () => {
            console.log(`Servidor disponible en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        console.error('No fue posible conectar con MYSQL.');
        process.exit(1); 
    
    }
}

iniciarServidor();
