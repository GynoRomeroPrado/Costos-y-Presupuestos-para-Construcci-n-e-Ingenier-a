import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectosService } from './proyectos.service';
import { ProyectosController } from './proyectos.controller';
import { Proyecto } from './entities/proyecto.entity';
import { GastoGeneral } from './entities/gasto-general.entity';
import { Metrado } from '../metrados/entities/metrado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto, GastoGeneral, Metrado])],
  controllers: [ProyectosController],
  providers: [ProyectosService],
  exports: [ProyectosService],
})
export class ProyectosModule {}
