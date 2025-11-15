import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { typeOrmConfig } from './config/typeorm.config';
import { redisConfig } from './config/redis.config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { InsumosModule } from './modules/insumos/insumos.module';
import { PartidasModule } from './modules/partidas/partidas.module';
import { ProveedoresModule } from './modules/proveedores/proveedores.module';
import { AcuModule } from './modules/acu/acu.module';
import { ProyectosModule } from './modules/proyectos/proyectos.module';
import { MetradosModule } from './modules/metrados/metrados.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRoot(typeOrmConfig),

    // Cache (Redis)
    CacheModule.registerAsync(redisConfig),

    // Common services
    CommonModule,

    // Feature modules
    AuthModule,
    UsersModule,
    InsumosModule,
    PartidasModule,
    ProveedoresModule,
    AcuModule,
    ProyectosModule,
    MetradosModule,
  ],
})
export class AppModule {}
