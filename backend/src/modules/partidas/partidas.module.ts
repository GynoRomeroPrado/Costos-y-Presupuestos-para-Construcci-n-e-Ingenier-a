import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartidasService } from './partidas.service';
import { PartidasController } from './partidas.controller';
import { Partida } from './entities/partida.entity';
import { EspecificacionTecnica } from './entities/especificacion-tecnica.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partida, EspecificacionTecnica])],
  controllers: [PartidasController],
  providers: [PartidasService],
  exports: [PartidasService],
})
export class PartidasModule {}
