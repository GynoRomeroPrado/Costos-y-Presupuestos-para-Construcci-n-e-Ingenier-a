import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcuService } from './acu.service';
import { AcuController } from './acu.controller';
import { Acu } from './entities/acu.entity';
import { AcuInsumo } from './entities/acu-insumo.entity';
import { Insumo } from '../insumos/entities/insumo.entity';
import { Partida } from '../partidas/entities/partida.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Acu, AcuInsumo, Insumo, Partida])],
  controllers: [AcuController],
  providers: [AcuService],
  exports: [AcuService],
})
export class AcuModule {}
