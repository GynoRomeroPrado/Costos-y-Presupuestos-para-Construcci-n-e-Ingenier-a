import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectosService } from './proyectos.service';
import { ProyectosController } from './proyectos.controller';
import { Proyecto } from './entities/proyecto.entity';
import { GastoGeneral } from './entities/gasto-general.entity';
import { Metrado } from '../metrados/entities/metrado.entity';
import { CommonModule } from '../common/common.module';
import { MetradosModule } from '../metrados/metrados.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proyecto, GastoGeneral, Metrado]),
    CommonModule,
    MetradosModule,
  ],
  controllers: [ProyectosController],
  providers: [ProyectosService],
  exports: [ProyectosService],
})
export class ProyectosModule {}
