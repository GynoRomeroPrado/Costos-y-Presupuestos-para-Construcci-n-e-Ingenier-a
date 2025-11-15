-- Initialization script for PostgreSQL database
-- This file is executed when the container is first created

-- Create database if not exists (Docker already creates it from env var)
-- CREATE DATABASE IF NOT EXISTS costos_presupuestos;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
DO $$ BEGIN
    CREATE TYPE insumo_tipo AS ENUM ('material', 'mano_obra', 'equipo', 'subcontrato');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE moneda_tipo AS ENUM ('PEN', 'USD', 'EUR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE proyecto_estado AS ENUM ('borrador', 'en_proceso', 'completado', 'cancelado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'ingeniero_costos', 'proyectista', 'visualizador');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE costos_presupuestos TO postgres;
