import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Metrado } from './entities/metrado.entity';

@Injectable()
export class MetradosService {
  constructor(
    @InjectRepository(Metrado)
    private readonly metradoRepository: Repository<Metrado>,
  ) {}

  // TODO: Implementar CRUD y cálculos
}
