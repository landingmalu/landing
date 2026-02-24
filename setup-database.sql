-- Script para crear la tabla de clientes en Supabase
-- Copia y ejecuta esto en el SQL Editor de Supabase

CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  pais VARCHAR(100) DEFAULT 'Chile',
  region VARCHAR(255),
  ciudad VARCHAR(255),
  direccion VARCHAR(500),
  notas TEXT,
  clase_seleccionada VARCHAR(50) DEFAULT 'reformer', -- 'reformer', 'lagree', 'combinado'
  monto INTEGER DEFAULT 369990,
  estado VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'pagado', 'cancelado'
  buy_order VARCHAR(26),
  auth_code VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para búsquedas rápidas
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_estado ON clientes(estado);
CREATE INDEX idx_clientes_created_at ON clientes(created_at);

-- Crear política RLS (opcional pero recomendado)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Política para que cualquiera pueda insertar (para registro)
CREATE POLICY "Enable insert for all users" ON clientes
  FOR INSERT WITH CHECK (true);

-- Política para que solo se puedan leer propios datos (opcional)
CREATE POLICY "Users can read their own data" ON clientes
  FOR SELECT USING (true); -- Cambiar a auth.uid() = user_id si tienes autenticación

-- Política para actualizar (solo backend)
CREATE POLICY "Enable updates for backend" ON clientes
  FOR UPDATE USING (true);
