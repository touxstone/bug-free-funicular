-- PostgreSQL version
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS meter_readings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    reading_date DATE NOT NULL,
    reading_value DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, reading_date)
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_meter_readings_updated_at
    BEFORE UPDATE ON meter_readings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar usuarios 1-10
INSERT INTO users (username) VALUES 
('usuario_1'),
('usuario_2'),
('usuario_3'),
('usuario_4'),
('usuario_5'),
('usuario_6'),
('usuario_7'),
('usuario_8'),
('usuario_9'),
('usuario_10')
ON CONFLICT (username) DO NOTHING;