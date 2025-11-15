import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetradosService } from './metrados.service';
import { MetradosController } from './metrados.controller';
import { Metrado } from './entities/metrado.entity';
import { Partida } from '../partidas/entities/partida.entity';
import { Acu } from '../acu/entities/acu.entity';
import { Proyecto } from '../proyectos/entities/proyecto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Metrado, Partida, Acu, Proyecto])],
  controllers: [MetradosController],
  providers: [MetradosService],
  exports: [MetradosService],
})
export class MetradosModule {}
