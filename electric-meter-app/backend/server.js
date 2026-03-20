const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Configuración de PostgreSQL
const pool = new Pool(process.env.DATABASE_URL 
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      }
    : {
    host: process.env.DB_HOST || 'postgres-db',
    user: process.env.DB_USER || 'app_user',
    password: process.env.DB_PASSWORD || 'app_password',
    database: process.env.DB_NAME || 'electric_meter_db',
    port: process.env.DB_PORT || 5432,
    // Importante para Neon y otros servicios cloud
    ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false } 
        : false
});

// Test de conexión inicial
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err.stack);
    } else {
        console.log('✅ Connected to PostgreSQL');
        release();
    }
});

// Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM users ORDER BY username'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Obtener lecturas por usuario
app.get('/api/readings/:userId', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM meter_readings WHERE user_id = $1 ORDER BY reading_date DESC',
            [req.params.userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching readings:', error);
        res.status(500).json({ error: 'Error al obtener lecturas' });
    }
});

// Crear o actualizar lectura
app.post('/api/readings', async (req, res) => {
    const { userId, readingDate, readingValue } = req.body;
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Verificar si ya existe
        const existing = await client.query(
            'SELECT id FROM meter_readings WHERE user_id = $1 AND reading_date = $2',
            [userId, readingDate]
        );

        let result;
        if (existing.rows.length > 0) {
            // Actualizar
            result = await client.query(
                `UPDATE meter_readings 
                 SET reading_value = $1, updated_at = CURRENT_TIMESTAMP 
                 WHERE user_id = $2 AND reading_date = $3 
                 RETURNING *`,
                [readingValue, userId, readingDate]
            );
        } else {
            // Insertar
            result = await client.query(
                `INSERT INTO meter_readings (user_id, reading_date, reading_value) 
                 VALUES ($1, $2, $3) 
                 RETURNING *`,
                [userId, readingDate, readingValue]
            );
        }

        await client.query('COMMIT');
        
        res.json({ 
            success: true, 
            message: existing.rows.length > 0 ? 'Lectura actualizada' : 'Lectura guardada',
            data: result.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error saving reading:', error);
        res.status(500).json({ error: 'Error al guardar la lectura' });
    } finally {
        client.release();
    }
});

// Obtener lectura específica
app.get('/api/readings/:userId/:readingDate', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM meter_readings WHERE user_id = $1 AND reading_date = $2',
            [req.params.userId, req.params.readingDate]
        );
        
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Lectura no encontrada' });
        }
    } catch (error) {
        console.error('Error fetching reading:', error);
        res.status(500).json({ error: 'Error al obtener la lectura' });
    }
});

// Health check endpoint (útil para orquestación)
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'healthy', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
});