import { DataSource } from 'typeorm';
import { seedInitialData } from './initial-data.seed';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'costos_db',
  synchronize: false,
  logging: true,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/**/*{.ts,.js}'],
});

async function runSeeds() {
  try {
    console.log('🌱 Iniciando carga de datos...');

    await AppDataSource.initialize();
    console.log('✅ Conexión a base de datos establecida');

    await seedInitialData(AppDataSource);

    await AppDataSource.destroy();
    console.log('✅ Seeds completados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando seeds:', error);
    process.exit(1);
  }
}

runSeeds();
