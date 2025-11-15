import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetradosService } from './metrados.service';
import { MetradosController } from './metrados.controller';
import { Metrado } from './entities/metrado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Metrado])],
  controllers: [MetradosController],
  providers: [MetradosService],
  exports: [MetradosService],
})
export class MetradosModule {}
